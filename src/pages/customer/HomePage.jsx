// src/pages/customer/HomePage.jsx

import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import ProductMarquee from '@/components/ui/ProductMarquee'

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <div className="page-enter bg-background">
      {/* Full-viewport Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.png')" }}></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        </div>
        {/* Hero Content */}
        <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto pt-24 animate-fade-in-up">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary drop-shadow-sm mb-6">
            Elegance in every petal.
          </h1>
          <p className="font-accent-italic text-accent-italic text-secondary mb-10 max-w-2xl mx-auto">
            Curated botanical masterpieces for the refined aesthetic. Experience the luxury of nature's most delicate creations, hand-selected in Cebu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-surface-tint text-on-primary rounded-full font-label-md text-label-md uppercase tracking-wider hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-primary/20"
            >
              Discover Collection
            </Link>
            <a
              href="#featured"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border ring-1 ring-secondary/50 text-secondary rounded-full font-label-md text-label-md uppercase tracking-wider hover:bg-secondary/5 transition-all duration-300 inline-block"
            >
              View Featured
            </a>
          </div>
        </div>
      </section>

      {/* Infinite Product Marquee */}
      <ProductMarquee />

      {/* Fresh Picks Grid */}
      <section id="featured" className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto scroll-mt-24">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Fresh Picks</h2>
          <div className="w-12 h-[1px] bg-secondary mx-auto"></div>
        </div>
        <ProductGrid
          products={featured}
          loading={loading}
          error={error}
          onRetry={fetchProducts}
        />
      </section>
    </div>
  )
}