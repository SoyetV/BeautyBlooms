// src/pages/customer/CatalogPage.jsx

import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import ProductMarquee from '@/components/ui/ProductMarquee'

export default function CatalogPage() {
  const { products, loading, error, fetchProducts } = useProducts()

  return (
    <div className="page-enter">
      {/* Shop Banner */}
      <section className="relative mb-8 flex h-[34vh] min-h-[240px] items-center justify-center overflow-hidden bg-bloom-950 sm:mb-12 sm:h-[40vh] sm:min-h-[300px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/10772718/pexels-photo-10772718.jpeg" 
            alt="Beautiful pink flowers" 
            className="w-full h-full object-cover object-center opacity-70 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bloom-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-3xl font-bold tracking-tight text-petal-50 drop-shadow-md sm:text-5xl lg:text-6xl">
            The Collection
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light text-petal-100 opacity-90 sm:mt-4 sm:text-lg">
            {!loading && !error 
              ? `Explore our curated selection of ${products.length} luxurious floral arrangements, designed to captivate.`
              : 'Explore our curated selection of luxurious floral arrangements, designed to captivate.'}
          </p>
        </div>
      </section>

      {/* Infinite Product Marquee */}
      <ProductMarquee />

      {/* Grid Container */}
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
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
