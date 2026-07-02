// src/hooks/useProducts.js
// Encapsulates all Supabase product CRUD operations.
// Components stay thin; data logic lives here.

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const PRODUCT_COLUMNS = 'id,name,description,price,stock_count,category,image_url,is_available,is_featured,created_at,updated_at'
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

export function useProducts({ adminMode = false } = {}) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  // ── READ ──────────────────────────────────────────────
  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)

    if (!supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
      setLoading(false)
      return
    }

    try {
      let query = supabase
        .from('products')
        .select(PRODUCT_COLUMNS)
        .order('created_at', { ascending: false })

      // Public catalog shows only available products unless admin
      if (!adminMode) {
        query = query.eq('is_available', true)
      }

      // Optional: only products marked as featured (for customer-facing marquee)
      if (filters.featuredOnly) {
        query = query.eq('is_featured', true)
      }

      // Optional category filter
      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category)
      }

      // Optional text search on name/description
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      const { data, error: sbError } = await query
      if (sbError) throw sbError
      setProducts(data)
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

    const { data, error } = await supabase
      .from('products')
      .insert({ ...fields, image_url })
      .select()
      .single()

    if (error) throw error
    setProducts(prev => [data, ...prev])
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

    const { data, error } = await supabase
      .from('products')
      .update({ ...fields, image_url })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setProducts(prev => prev.map(p => (p.id === id ? data : p)))
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
      throw error
    }
    setProducts(prev => prev.map(p => p.id === id ? data : p))
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