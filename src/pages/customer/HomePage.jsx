// src/pages/customer/HomePage.jsx

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
        className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden sm:min-h-[90vh]"
        style={{ background: 'linear-gradient(135deg, #500724 0%, #831843 40%, #2d1b2e 100%)' }}
        aria-label="Welcome to Beauty Blooms"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
          />
        </div>

        {/* Ambient orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -left-48 -top-48 h-[360px] w-[360px] rounded-full opacity-20 sm:-left-32 sm:-top-32 sm:h-[600px] sm:w-[600px]"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', filter: 'blur(60px)' }}
          />
          <div
            className="absolute -bottom-44 -right-44 h-[320px] w-[320px] rounded-full opacity-15 sm:-bottom-32 sm:-right-32 sm:h-[500px] sm:w-[500px]"
            style={{ background: 'radial-gradient(circle, #c08d4b 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 sm:h-[800px] sm:w-[800px]"
            style={{ background: 'radial-gradient(circle, #f9a8d4 0%, transparent 60%)', filter: 'blur(100px)' }}
          />
        </div>

        {/* Dark gradient bottom fade */}
        <div className="absolute inset-0 z-1" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(45,27,46,0.6) 100%)' }} />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
          {/* Eyebrow — glass pill */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-200 sm:mb-8 sm:px-5 sm:text-xs sm:tracking-[0.25em]"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <span className="w-1 h-1 rounded-full bg-gold-300 inline-block" aria-hidden="true" />
            Exquisite &amp; Fresh
            <span className="w-1 h-1 rounded-full bg-gold-300 inline-block" aria-hidden="true" />
          </div>

          <h1
            className="font-display text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl"
            style={{ color: '#fdf2f8', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            Elegance in{' '}
            <span
              className="italic font-light"
              style={{
                backgroundImage: 'linear-gradient(135deg, #f9a8d4 0%, #ec4899 50%, #c08d4b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              every petal.
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed sm:mt-8 sm:text-lg"
            style={{ color: 'rgba(253,242,248,0.8)', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
          >
            Hand-arranged, premium bouquets crafted with the most luxurious seasonal blooms.
            Elevate your moments with Beauty Blooms.
          </p>

          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 sm:px-8 sm:py-4 sm:text-sm"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(253,242,248,0.9)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              Discover the Collection
            </Link>
            <a
              href="#featured"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 sm:px-8 sm:py-4 sm:text-sm"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(253,242,248,0.9)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              View Featured
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 hidden flex-col items-center gap-2 opacity-50 sm:flex lg:mt-20">
            <span className="text-xs uppercase tracking-[0.2em] text-petal-200">Scroll</span>
            <div
              className="w-px h-10 rounded-full"
              style={{ background: 'linear-gradient(to bottom, rgba(249,168,212,0.8), transparent)' }}
            />
          </div>
        </div>
      </section>

      {/* Infinite Product Marquee */}
      <ProductMarquee />

      {/* Trust strip */}
      <section
        className="border-y"
        style={{ borderColor: 'rgba(249,168,212,0.2)' }}
        aria-label="Why choose Bloom"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-3 sm:gap-6 sm:px-6 sm:py-12">
          {[
            { icon: '🌿', heading: 'Always fresh', body: 'Sourced daily from local farms and markets.' },
            { icon: '🚚', heading: 'Same-day delivery', body: 'Order by noon, delivered to your door by 6 PM.' },
            { icon: '💐', heading: 'Hand-arranged', body: 'Every bouquet crafted with care and intention.' },
          ].map(item => (
            <div
              key={item.heading}
              className="flex flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all duration-300 sm:p-6"
              style={{
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(249,168,212,0.2)',
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl sm:h-12 sm:w-12 sm:text-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(192,141,75,0.1))',
                  border: '1px solid rgba(236,72,153,0.15)',
                }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <h3 className="font-semibold text-charcoal-900">{item.heading}</h3>
              <p className="text-sm text-charcoal-500">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section id="featured" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bloom-500 mb-2">Handpicked for you</p>
            <h2 className="font-display text-2xl font-bold text-charcoal-900 sm:text-3xl">Fresh picks</h2>
          </div>
          <Link
            to="/catalog"
            className="text-sm font-semibold text-bloom-500 hover:text-bloom-700 transition-colors flex items-center gap-1"
          >
            View all
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
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
