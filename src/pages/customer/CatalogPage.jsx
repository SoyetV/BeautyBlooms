// src/pages/customer/CatalogPage.jsx

import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export default function CatalogPage() {
  const { products, loading, error, fetchProducts } = useProducts()

  return (
    <div className="page-enter">
      {/* Shop Banner */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-12 bg-bloom-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/10772718/pexels-photo-10772718.jpeg" 
            alt="Beautiful pink flowers" 
            className="w-full h-full object-cover object-center opacity-70 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bloom-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-petal-50 tracking-tight drop-shadow-md">
            The Collection
          </h1>
          <p className="mt-4 text-petal-100 font-light max-w-xl mx-auto sm:text-lg opacity-90">
            {!loading && !error 
              ? `Explore our curated selection of ${products.length} luxurious floral arrangements, designed to captivate.`
              : 'Explore our curated selection of luxurious floral arrangements, designed to captivate.'}
          </p>
        </div>
      </section>

      {/* Grid Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={fetchProducts}
        />
      </div>
    </div>
  )
}
