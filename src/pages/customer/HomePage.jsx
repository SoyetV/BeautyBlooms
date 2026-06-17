// src/pages/customer/HomePage.jsx
// Landing page with hero section and featured products preview.

import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-bloom-50 via-petal-50 to-white"
        aria-label="Welcome to Bloom"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-bloom-400 mb-3">
            Fresh from the farm
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Flowers that speak<br />
            <span className="text-bloom-500 italic">without words.</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-gray-500 text-lg leading-relaxed">
            Hand-arranged bouquets using the freshest seasonal blooms.
            Order before noon for same-day delivery in Cebu City.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/catalog" className="btn-primary px-8 py-3 text-base">
              Shop all flowers
            </Link>
            <a href="#featured" className="btn-secondary px-8 py-3 text-base">
              See what's fresh
            </a>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-bloom-100 opacity-40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-petal-200 opacity-30 blur-2xl" aria-hidden="true" />
      </section>

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
