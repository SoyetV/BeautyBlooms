import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import ProductMarquee from '@/components/ui/ProductMarquee'

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <div className="page-enter pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Mesh/Gradient */}
        <div className="absolute inset-0 z-0">
           <img
            src="/hero-bg.png"
            alt=""
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-background/20 via-brand-background/60 to-brand-background" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-brand-primary/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full bg-brand-secondary/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="animate-fade-in-down mb-8">
            <span className="inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              Bespoke Floral Atelier
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-brand-on-surface tracking-tight animate-fade-in-up">
            Elegance in <br />
            <span className="italic font-light text-brand-primary">every petal.</span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed text-brand-on-surface-variant animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Curating the finest seasonal blooms with a touch of luxury. <br className="hidden md:block" />
            Hand-arranged in Cebu for your most cherished moments.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Link to="/catalog" className="btn-primary w-full sm:w-auto">
              Shop The Collection
            </Link>
            <a href="#featured" className="btn-secondary w-full sm:w-auto">
              View Featured
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-40">
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-on-surface-variant">Explore</span>
           <div className="w-px h-12 bg-gradient-to-b from-brand-primary to-transparent" />
        </div>
      </section>

      {/* Infinite Product Marquee */}
      <div className="py-12 border-y border-brand-secondary/5 bg-white/20 backdrop-blur-sm">
        <ProductMarquee />
      </div>

      {/* Featured Collection */}
      <section id="featured" className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-on-surface leading-tight">
              Our Latest <span className="italic font-light">Curation</span>
            </h2>
            <p className="mt-4 text-sm font-light text-brand-on-surface-variant leading-relaxed">
              Hand-picked and ethically sourced, our current season's favorites are chosen for their exceptional quality and ephemeral beauty.
            </p>
          </div>
          <Link to="/catalog" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary hover:text-brand-primary-container transition-colors">
            View All Blooms
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
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

      {/* Why Choose Us - Romantic Section */}
      <section className="bg-brand-surface-container-low py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: 'Freshly Picked', desc: 'Sourced daily from our private growers to ensure absolute longevity.' },
              { title: 'Artfully Crafted', desc: 'Each arrangement is a unique piece of botanical art, never duplicated.' },
              { title: 'Cebu Delivery', desc: 'Carefully hand-delivered across Cebu City to maintain petal perfection.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-3xl glass transition-transform duration-500 group-hover:-rotate-6">
                   <span className="text-2xl">🌸</span>
                </div>
                <h3 className="font-display text-xl font-bold text-brand-on-surface mb-3">{item.title}</h3>
                <p className="text-sm font-light leading-relaxed text-brand-on-surface-variant">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
