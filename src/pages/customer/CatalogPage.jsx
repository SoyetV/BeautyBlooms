import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import ProductMarquee from '@/components/ui/ProductMarquee'

export default function CatalogPage() {
  const { products, loading, error, fetchProducts } = useProducts()

  return (
    <div className="page-enter pt-16 sm:pt-20 min-h-screen">
      {/* Banner */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-brand-surface-container-highest">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/10772718/pexels-photo-10772718.jpeg" 
            alt="Beautiful pink flowers" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-brand-background" />
        </div>
        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-4 block">The Collection</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-brand-on-surface tracking-tight">
            Curated <span className="italic font-light">Elegance</span>
          </h1>
        </div>
      </section>

      {/* Marquee Accent */}
      <div className="border-y border-brand-secondary/5 bg-white/20 py-8">
        <ProductMarquee />
      </div>

      {/* Catalog Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
        <div className="mb-12">
          <p className="text-xs font-medium text-brand-on-surface-variant">
            Showing all {products.length} exclusive arrangements
          </p>
        </div>
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
