// src/components/catalog/ProductGrid.jsx
// Renders the full customer-facing product catalog with search,
// category filtering, and loading / error / empty states.

import { useMemo, useState } from 'react'
import { ProductCard } from './ProductCard'
import { CategoryFilter } from './CategoryFilter'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'

export function ProductGrid({ products, loading, error, onRetry }) {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')

  // Derive category list from actual products
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category))].sort(),
    [products]
  )

  // Client-side filter (fast; avoids extra DB round-trips for simple browsing)
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter(p => {
      const matchesCat    = category === 'All' || p.category === category
      const matchesSearch = !term ||
        p.name.toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term)
      return matchesCat && matchesSearch
    })
  }, [products, search, category])

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" aria-live="polite" aria-busy="true">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500">Loading flowers…</p>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Couldn't load products"
        message={error}
        action={
          onRetry && (
            <button onClick={onRetry} className="btn-primary">
              Try again
            </button>
          )
        }
      />
    )
  }

  return (
    <section aria-label="Flower catalog">
      {/* Search + filter bar */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search input */}
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search flowers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
            aria-label="Search flowers"
          />
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            active={category}
            onChange={setCategory}
          />
        )}
      </div>

      {/* Results summary (for screen readers) */}
      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'flower' : 'flowers'} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🌷"
          title="No flowers found"
          message={
            search
              ? `No results for "${search}". Try a different search or category.`
              : 'No flowers available in this category right now.'
          }
          action={
            (search || category !== 'All') && (
              <button
                onClick={() => { setSearch(''); setCategory('All') }}
                className="btn-secondary"
              >
                Clear filters
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, idx) => {
            const staggerDelay = idx < 12 ? `${idx * 100}ms` : '0ms';
            return (
              <div key={product.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: staggerDelay }}>
                <ProductCard product={product} />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
