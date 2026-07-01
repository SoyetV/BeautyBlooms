// src/pages/customer/CatalogPage.jsx
// Modern Flora — compact header, no banner image, no marquee (kept on HomePage only).

import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export default function CatalogPage() {
  const { products, loading, error, fetchProducts } = useProducts()

  return (
    <div className="page-enter bg-background pt-24 md:pt-32">

      {/* Compact header */}
      <header className="px-margin-mobile md:px-margin-desktop pb-10 md:pb-14">
        <div className="mx-auto max-w-container">
          <p className="eyebrow-strip mb-3"><span>Floral Atelier</span></p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <h1 className="font-display text-display-xl md:text-display-2xl text-foreground tracking-tight leading-[1.05]">
              The Collection
            </h1>
            <p className="text-body-md text-muted max-w-sm md:text-right">
              {!loading && !error
                ? `${products.length} ${products.length === 1 ? 'arrangement' : 'arrangements'} available, hand-arranged to order.`
                : 'Curated floral artistry, hand-arranged to order in Cebu City.'}
            </p>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="mx-auto max-w-container px-margin-mobile md:px-margin-desktop pb-section-y">
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={fetchProducts}
        />
      </main>
    </div>
  )
}
