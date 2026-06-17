// src/pages/customer/CatalogPage.jsx

import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export default function CatalogPage() {
  const { products, loading, error, fetchProducts } = useProducts()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">All Flowers</h1>
        <p className="mt-1 text-gray-500 text-sm">
          {!loading && !error && `${products.length} arrangements available`}
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
