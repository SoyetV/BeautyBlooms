// src/pages/customer/CatalogPage.jsx

import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export default function CatalogPage() {
  const { products, loading, error, fetchProducts } = useProducts()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 page-enter">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-900 tracking-tight">The Collection</h1>
        <p className="mt-3 text-charcoal-600 font-light max-w-xl mx-auto">
          {!loading && !error && `Explore our curated selection of ${products.length} luxurious floral arrangements, designed to captivate.`}
        </p>
      </div>
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={fetchProducts}
      />
    </div>
  )
}
