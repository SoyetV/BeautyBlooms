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
        <p className="font-body-md text-body-md text-on-surface-variant">Loading flowers…</p>
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
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4">
        {/* Search input */}
        <div className="relative">
          <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            placeholder="Search the collection…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-12"
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
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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