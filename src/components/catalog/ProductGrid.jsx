import { useMemo, useState } from 'react'
import { ProductCard } from './ProductCard'
import { CategoryFilter } from './CategoryFilter'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'

export function ProductGrid({ products, loading, error, onRetry }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category))].sort(),
    [products]
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter(p => {
      const matchesCat = category === 'All' || p.category === category
      const matchesSearch = !term ||
        p.name.toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term)
      return matchesCat && matchesSearch
    })
  }, [products, search, category])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6" aria-live="polite" aria-busy="true">
        <Spinner size="lg" />
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-on-surface/40">Gathering the freshest blooms...</p>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon="🥀"
        title="Something went wrong"
        message={error}
        action={
          onRetry && (
            <button onClick={onRetry} className="btn-primary">
              Retry Selection
            </button>
          )
        }
      />
    )
  }

  return (
    <section aria-label="Flower catalog" className="space-y-12">
      {/* Filtering Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            active={category}
            onChange={setCategory}
          />
        )}

        <div className="relative w-full md:w-72">
          <input
            type="search"
            placeholder="Search our collection..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 rounded-full bg-white/40 border-brand-secondary/5"
            aria-label="Search flowers"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-on-surface/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
        </div>
      </div>

      {/* Grid Display */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🌬️"
          title="No blooms found"
          message={search ? `We couldn't find any results for "${search}".` : "This category is currently being curated."}
          action={
            (search || category !== 'All') && (
              <button
                onClick={() => { setSearch(''); setCategory('All') }}
                className="btn-secondary"
              >
                Clear Selection
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, idx) => (
            <div key={product.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
