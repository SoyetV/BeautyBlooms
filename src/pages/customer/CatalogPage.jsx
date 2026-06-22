// src/pages/customer/CatalogPage.jsx

import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import ProductMarquee from '@/components/ui/ProductMarquee'

export default function CatalogPage() {
  const { products, loading, error, fetchProducts } = useProducts()

  return (
    <div className="page-enter bg-background">
      {/* Shop Banner */}
      <section className="relative mb-8 flex h-[34vh] min-h-[240px] items-center justify-center overflow-hidden bg-surface sm:mb-12 sm:h-[40vh] sm:min-h-[300px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/10772718/pexels-photo-10772718.jpeg" 
            alt="Beautiful pink flowers" 
            className="w-full h-full object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display-lg text-display-lg text-primary drop-shadow-sm">
            The Collection
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-accent-italic text-accent-italic text-secondary">
            {!loading && !error 
              ? `Explore our curated selection of ${products.length} luxurious floral arrangements, designed to captivate.`
              : 'Explore our curated selection of luxurious floral arrangements, designed to captivate.'}
          </p>
        </div>
      </section>

      {/* Infinite Product Marquee */}
      <ProductMarquee />

      {/* Grid Container */}
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop pb-10 pt-6 sm:pb-16 sm:pt-8">
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
