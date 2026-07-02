// src/hooks/useProducts.js
// Encapsulates all Supabase product CRUD operations.
// Components stay thin; data logic lives here.

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Two column lists: one with is_featured (new schema), one without (legacy).
// We try the new one first; if the column doesn't exist yet, we fall back.
const PRODUCT_COLUMNS_FULL    = 'id,name,description,price,stock_count,category,image_url,is_available,is_featured,created_at,updated_at'
const PRODUCT_COLUMNS_LEGACY  = 'id,name,description,price,stock_count,category,image_url,is_available,created_at,updated_at'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

function assertValidImageFile(imageFile) {
  if (!imageFile) return null

  if (!ALLOWED_IMAGE_TYPES.has(imageFile.type)) {
    throw new Error('Product images must be JPG, PNG, or WebP files.')
  }

  if (imageFile.size > MAX_IMAGE_BYTES) {
    throw new Error('Product images must be smaller than 5 MB.')
  }

  return ALLOWED_IMAGE_TYPES.get(imageFile.type)
}

// Normalize any product row so is_featured is always a boolean,
// even if the column doesn't exist in the database yet.
function normalizeProduct(p) {
  return { ...p, is_featured: p.is_featured === true }
}

export function useProducts({ adminMode = false } = {}) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  // Cache whether the is_featured column exists. Avoids retrying the
  // failing query on every refetch once we know the column is missing.
  const hasFeaturedColumnRef = useRef(null) // null = unknown, true/false = known

  // ── READ ──────────────────────────────────────────────
  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)

    if (!supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
      setLoading(false)
      return
    }

    // Decide which column list to use. If we already know the column is
    // missing, skip straight to the legacy query.
    const useFullColumns = hasFeaturedColumnRef.current !== false
    const columns = useFullColumns ? PRODUCT_COLUMNS_FULL : PRODUCT_COLUMNS_LEGACY

    const buildQuery = (colList) => {
      let q = supabase
        .from('products')
        .select(colList)
        .order('created_at', { ascending: false })

      if (!adminMode) {
        q = q.eq('is_available', true)
      }

      // Only apply featured filter if we're using the full column list
      // (otherwise the column doesn't exist and the filter would error).
      if (filters.featuredOnly && colList === PRODUCT_COLUMNS_FULL) {
        q = q.eq('is_featured', true)
      }

      if (filters.category && filters.category !== 'All') {
        q = q.eq('category', filters.category)
      }

      if (filters.search) {
        q = q.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }
      return q
    }

    try {
      let { data, error: sbError } = await buildQuery(columns)

      // ── Fallback: if is_featured column doesn't exist, retry without it ──
      if (
        sbError &&
        useFullColumns &&
        /is_featured/i.test(sbError.message || '')
      ) {
        console.warn(
          '[useProducts] is_featured column missing — falling back to legacy query. ' +
          'Run supabase/migrations/2026_07_02_add_is_featured.sql to enable marquee curation.'
        )
        hasFeaturedColumnRef.current = false
        const legacy = await buildQuery(PRODUCT_COLUMNS_LEGACY)
        sbError = legacy.error
        data = legacy.data
      } else if (!sbError && useFullColumns) {
        // Query succeeded with is_featured — column exists.
        hasFeaturedColumnRef.current = true
      }

      if (sbError) throw sbError

      // Normalize: ensure is_featured is always present (false if column was missing)
      const normalized = (data || []).map(normalizeProduct)
      setProducts(normalized)
    } catch (err) {
      console.error('[useProducts] fetchProducts:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [adminMode])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (!supabase) return

    const channelName = `products-${Math.random().toString(36).slice(2)}`
    const channel = supabase.channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchProducts])

  // Helper: strip is_featured from a fields object if the column is known
  // to be missing from the database. Prevents INSERT/UPDATE errors.
  function stripFeaturedIfMissing(fields) {
    if (hasFeaturedColumnRef.current === false && 'is_featured' in fields) {
      const rest = { ...fields }
      delete rest.is_featured
      return rest
    }
    return fields
  }

  // ── CREATE ────────────────────────────────────────────
  // imageFile is a File object (optional). Returns created product or throws.
  async function createProduct(fields, imageFile = null) {
    if (!supabase) throw new Error('Supabase is not configured.')
    let image_url = null

    if (imageFile) {
      const ext      = assertValidImageFile(imageFile)
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          upsert: false,
          contentType: imageFile.type,
          cacheControl: '31536000',
        })
      if (uploadErr) throw uploadErr

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)
      image_url = urlData.publicUrl
    }

    const safeFields = stripFeaturedIfMissing(fields)
    const { data, error } = await supabase
      .from('products')
      .insert({ ...safeFields, image_url })
      .select()
      .single()

    if (error) throw error
    setProducts(prev => [normalizeProduct(data), ...prev])
    return data
  }

  // ── UPDATE ────────────────────────────────────────────
  async function updateProduct(id, fields, imageFile = null) {
    if (!supabase) throw new Error('Supabase is not configured.')
    let image_url = fields.image_url ?? null

    if (imageFile) {
      const ext      = assertValidImageFile(imageFile)
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          upsert: false,
          contentType: imageFile.type,
          cacheControl: '31536000',
        })
      if (uploadErr) throw uploadErr

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)
      image_url = urlData.publicUrl
    }

    const safeFields = stripFeaturedIfMissing(fields)
    const { data, error } = await supabase
      .from('products')
      .update({ ...safeFields, image_url })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setProducts(prev => prev.map(p => (p.id === id ? normalizeProduct(data) : p)))
    return data
  }

  // ── DELETE ────────────────────────────────────────────
  async function deleteProduct(id) {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  // ── TOGGLE FEATURED (marquee) ─────────────────────────
  // Quick flip of the is_featured flag — used by admin to curate
  // which products appear in the customer-facing marquee.
  async function toggleFeatured(id, nextValue) {
    if (!supabase) throw new Error('Supabase is not configured.')

    // If we know the column is missing, give a helpful actionable error.
    if (hasFeaturedColumnRef.current === false) {
      throw new Error(
        'The is_featured column does not exist in your database yet. ' +
        'Run supabase/migrations/2026_07_02_add_is_featured.sql in your Supabase SQL Editor to enable marquee curation.'
      )
    }

    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_featured: nextValue } : p))
    const { data, error } = await supabase
      .from('products')
      .update({ is_featured: nextValue })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      // Revert on error
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_featured: !nextValue } : p))

      // If this was the column-missing error, cache that fact so future
      // calls skip straight to the helpful error message above, and
      // refetch with the legacy column list.
      if (/is_featured/i.test(error.message || '')) {
        hasFeaturedColumnRef.current = false
        fetchProducts()
        throw new Error(
          'The is_featured column does not exist in your database yet. ' +
          'Run supabase/migrations/2026_07_02_add_is_featured.sql in your Supabase SQL Editor to enable marquee curation.'
        )
      }
      throw error
    }
    // Query succeeded — column exists
    hasFeaturedColumnRef.current = true
    setProducts(prev => prev.map(p => p.id === id ? normalizeProduct(data) : p))
    return data
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
  }
}