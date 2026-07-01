// src/components/catalog/ProductGrid.jsx
// Modern Flora — skeleton loaders, quiet filter bar, staggered grid.

import { useMemo, useState } from 'react'
import { ProductCard } from './ProductCard'
import { CategoryFilter } from './CategoryFilter'
import { EmptyState } from '@/components/ui/EmptyState'
import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton'

export function ProductGrid({ products, loading, error, onRetry }) {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')

  // Derive category list from actual products
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category))].sort(),
    [products]
  )

  // Client-side filter
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

  // ── Loading (skeleton grid) ─────────────────────────
  if (loading) {
    return (
      <div aria-live="polite" aria-busy="true">
        {/* Skeleton filter bar */}
        <div className="mb-8 flex flex-col gap-3">
          <Skeleton variant="block" className="h-11 w-full max-w-md" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="block" className="h-9 w-20" />
            ))}
          </div>
        </div>

        {/* Skeleton grid */}
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────
  if (error) {
    return (
      <EmptyState
        icon="error"
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
      <div className="mb-8 flex flex-col gap-3">
        {/* Search input */}
        <div className="relative">
          <span
            className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle"
            style={{ fontSize: '20px' }}
            aria-hidden="true"
          >
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

        {/* Result count */}
        <p className="text-body-sm text-subtle mt-1">
          {filtered.length} {filtered.length === 1 ? 'arrangement' : 'arrangements'}
          {category !== 'All' && <> in {category}</>}
          {search && <> matching “{search}”</>}
        </p>
      </div>

      {/* SR-only live region */}
      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'flower' : 'flowers'} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="search_off"
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
            const staggerDelay = idx < 8 ? `${idx * 60}ms` : '0ms';
            return (
              <div
                key={product.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: staggerDelay }}
              >
                <ProductCard product={product} />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
