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

      {/* Trust Strip */}
      <section className="bg-surface-container-highest py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/40">
          <div className="flex flex-col items-center pt-8 md:pt-0 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <div className="w-16 h-16 rounded-full bg-surface-bright flex items-center justify-center text-primary mb-4 shadow-sm ring-1 ring-primary/10">
              <span className="material-symbols-outlined text-3xl icon-fill">local_florist</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Always Fresh</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mx-auto">Sourced daily from premium local and international growers to ensure longevity.</p>
          </div>
          <div className="flex flex-col items-center pt-8 md:pt-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="w-16 h-16 rounded-full bg-surface-bright flex items-center justify-center text-primary mb-4 shadow-sm ring-1 ring-primary/10">
              <span className="material-symbols-outlined text-3xl icon-fill">local_shipping</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Same-Day Delivery</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mx-auto">Available for Cebu City and surrounding metropolitan areas on orders placed before 2 PM.</p>
          </div>
          <div className="flex flex-col items-center pt-8 md:pt-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="w-16 h-16 rounded-full bg-surface-bright flex items-center justify-center text-primary mb-4 shadow-sm ring-1 ring-primary/10">
              <span className="material-symbols-outlined text-3xl icon-fill">handshake</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Hand-Arranged</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mx-auto">Crafted with meticulous attention to detail by our master florists.</p>
          </div>
        </div>
      </section>

      {/* Fresh Picks Grid */}
      <section id="featured" className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
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
