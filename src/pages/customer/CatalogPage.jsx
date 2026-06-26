// src/pages/customer/CatalogPage.jsx

import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import ProductMarquee from '@/components/ui/ProductMarquee'

export default function CatalogPage() {
  const { products, loading, error, fetchProducts } = useProducts()

  return (
    <div className="page-enter bg-background pt-[80px]">
      {/* Shop Banner */}
      <section className="relative mb-8 flex h-[409px] min-h-[300px] items-center justify-center overflow-hidden sm:mb-12">
        <div className="absolute inset-0 z-0 bg-surface-container-highest">
          <img
            src="https://images.pexels.com/photos/10772718/pexels-photo-10772718.jpeg"
            alt="Beautiful pink flowers"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop animate-fade-in-up">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
            The Collection
          </h1>
          <p className="font-accent-italic text-accent-italic text-on-surface-variant">
            {!loading && !error
              ? `Curated floral artistry. ${products.length} arrangements available.`
              : 'Curated floral artistry — explore our luxurious floral arrangements.'}
          </p>
        </div>
      </section>

      {/* Infinite Product Marquee */}
      <ProductMarquee />

      {/* Grid Container */}
      <main className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-12 md:py-20">
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