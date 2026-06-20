// src/pages/customer/HomePage.jsx
// Landing page with hero section and featured products preview.

import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import ProductMarquee from '@/components/ui/ProductMarquee'

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <div className="page-enter">
      {/* Hero */}
      <section
        className="relative flex items-center justify-center min-h-[85vh] bg-bloom-950 overflow-hidden"
        aria-label="Welcome to Beauty Blooms"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Luxurious floral arrangement" 
            className="w-full h-full object-cover object-center opacity-70 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bloom-950/80 via-bloom-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 text-center flex flex-col items-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-300 mb-6 drop-shadow-sm">
            Exquisite & Fresh
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-petal-50 leading-tight drop-shadow-md">
            Elegance in <span className="text-bloom-300 italic font-light">every petal.</span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-petal-100 text-lg sm:text-xl font-light leading-relaxed opacity-90">
            Hand-arranged, premium bouquets crafted with the most luxurious seasonal blooms. 
            Elevate your moments with Beauty Blooms.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
            <Link to="/catalog" className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-300/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-sm tracking-wider uppercase font-semibold text-petal-50 transition-all hover:bg-white/20 active:scale-95">
              Discover the Collection
            </Link>
            <a href="#featured" className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-300/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-sm tracking-wider uppercase font-semibold text-petal-50 transition-all hover:bg-white/20 active:scale-95">
              View Featured
            </a>
          </div>
        </div>
      </section>

      {/* Infinite Product Marquee */}
      <ProductMarquee />

      {/* Featured products */}
      <section id="featured" className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">Fresh picks</h2>
          <Link to="/catalog" className="text-sm font-medium text-bloom-500 hover:text-bloom-700 transition-colors">
            View all →
          </Link>
        </div>
        <ProductGrid
          products={featured}
          loading={loading}
          error={error}
          onRetry={fetchProducts}
        />
      </section>

      {/* Trust strip */}
      <section className="bg-petal-50 border-y border-petal-100" aria-label="Why choose Bloom">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
          {[
            { icon: '🌿', heading: 'Always fresh', body: 'Sourced daily from local farms and markets.' },
            { icon: '🚚', heading: 'Same-day delivery', body: 'Order by noon, delivered to your door by 6 PM.' },
            { icon: '💐', heading: 'Hand-arranged', body: 'Every bouquet crafted with care and intention.' },
          ].map(item => (
            <div key={item.heading} className="flex flex-col items-center gap-2">
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <h3 className="font-semibold text-gray-900">{item.heading}</h3>
              <p className="text-sm text-gray-500">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
