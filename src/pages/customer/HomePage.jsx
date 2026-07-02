// src/pages/customer/HomePage.jsx
// Modern Flora — asymmetric split hero, 3-feature trust block,
// fresh picks grid, editorial testimonial, newsletter band.

import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import ProductMarquee from '@/components/ui/ProductMarquee'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <div className="page-enter bg-background">

      {/* ═══ HERO — asymmetric split ═══ */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto max-w-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left: copy */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <p className="eyebrow-strip">
                <span>Floral Atelier · Cebu City</span>
              </p>

              <h1 className="font-display text-display-2xl md:text-display-xl text-foreground tracking-tight leading-[1.05]">
                Elegance in
                <br />
                <em className="not-italic font-display italic text-primary-700">every petal.</em>
              </h1>

              <p className="text-body-lg text-muted max-w-md leading-relaxed">
                Curated botanical masterpieces for the refined aesthetic.
                Hand-selected stems, arranged with intention, delivered the same day across Cebu.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button as={Link} to="/catalog" size="lg">
                  Discover Collection
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">arrow_forward</span>
                </Button>
                <Button as={Link} to="/catalog?sort=featured" variant="secondary" size="lg">
                  View Featured
                </Button>
              </div>

              {/* Trust micro-strip — inline, no logos, max 3 items */}
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sage-600" style={{ fontSize: '18px' }} aria-hidden="true">eco</span>
                  Sourced daily
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sage-600" style={{ fontSize: '18px' }} aria-hidden="true">local_shipping</span>
                  Same-day delivery
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sage-600" style={{ fontSize: '18px' }} aria-hidden="true">handshake</span>
                  Hand-arranged
                </li>
              </ul>
            </div>

            {/* Right: image with floating price card */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-surface-2 shadow-lg">
                <picture>
                  <source srcSet="/hero-bg.webp" type="image/webp" />
                  <img
                    src="/hero-bg.jpg"
                    alt="A hand-tied bouquet of warm pink and cream roses, eucalyptus, and ranunculus arranged on a cream linen surface."
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent" />
              </div>

              {/* Floating card — best seller */}
              <div className="absolute -bottom-5 -left-2 sm:left-6 bg-surface rounded-xl shadow-lg border border-border p-4 max-w-[15rem]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined icon-fill text-accent-500" style={{ fontSize: '14px' }} aria-hidden="true">star</span>
                  <span className="text-eyebrow uppercase tracking-eyebrow text-accent-700">Best Seller</span>
                </div>
                <p className="font-display text-display-sm font-semibold text-foreground leading-tight">
                  Blush Symphony
                </p>
                <p className="text-body-sm text-muted mt-0.5">Peonies & garden roses</p>
                <p className="price text-price-md mt-2">₱4,500</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE — compact auto-scrolling carousel ═══ */}
      <ProductMarquee size="compact" />

      {/* ═══ FEATURE BLOCK — 3 columns, was previously buried in footer ═══ */}
      <section className="px-margin-mobile md:px-margin-desktop py-section-y-sm">
        <div className="mx-auto max-w-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {[
              {
                icon: 'local_florist',
                title: 'Always Fresh',
                body: 'Stems are sourced each morning from premium growers across the Visayas, so what arrives at your door still smells like the garden.',
              },
              {
                icon: 'local_shipping',
                title: 'Same-Day Delivery',
                body: 'Order before 2 PM and we will hand-deliver across Cebu City metro the same day, with care notes for every bouquet.',
              },
              {
                icon: 'handshake',
                title: 'Hand-Arranged',
                body: 'Each arrangement is composed by a florist, never a machine. No two bouquets are identical, and that is the point.',
              },
            ].map(item => (
              <div key={item.title} className="bg-surface p-8 md:p-10 flex flex-col gap-4">
                <span
                  className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary-50 text-primary-700"
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined icon-fill" style={{ fontSize: '24px' }}>{item.icon}</span>
                </span>
                <h3 className="font-display text-display-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-body-md text-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FRESH PICKS GRID ═══ */}
      <section
        id="featured"
        className="px-margin-mobile md:px-margin-desktop py-section-y scroll-mt-24"
      >
        <div className="mx-auto max-w-container">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14">
            <div className="max-w-xl">
              <p className="eyebrow-strip mb-3"><span>This week</span></p>
              <h2 className="font-display text-display-lg md:text-display-xl text-foreground tracking-tight leading-[1.1]">
                Fresh picks from the atelier
              </h2>
            </div>
            <Button as={Link} to="/catalog" variant="ghost" iconRight={
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">arrow_forward</span>
            }>
              View all flowers
            </Button>
          </div>

          <ProductGrid
            products={featured}
            loading={loading}
            error={error}
            onRetry={fetchProducts}
          />
        </div>
      </section>

      {/* ═══ EDITORIAL TESTIMONIAL ═══ */}
      <section className="px-margin-mobile md:px-margin-desktop py-section-y-sm">
        <div className="mx-auto max-w-content">
          <figure className="flex flex-col items-center text-center gap-6">
            <span
              className="material-symbols-outlined icon-fill text-primary-300"
              style={{ fontSize: '40px' }}
              aria-hidden="true"
            >
              format_quote
            </span>
            <blockquote>
              <p className="font-display italic text-display-md md:text-display-lg text-foreground leading-[1.3]">
                The bouquet arrived looking exactly as it did in the photo,
                maybe better. There is a quiet confidence to the way
                Beauty Blooms arranges flowers.
              </p>
            </blockquote>
            <figcaption className="flex flex-col items-center gap-1">
              <span className="text-body-md font-semibold text-foreground">Maria Reyes</span>
              <span className="text-body-sm text-subtle">Cebu City · Verified buyer</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ NEWSLETTER BAND ═══ */}
      <section className="px-margin-mobile md:px-margin-desktop py-section-y">
        <div className="mx-auto max-w-container">
          <div className="bg-foreground rounded-2xl px-6 py-12 md:px-16 md:py-16 text-center md:text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="flex flex-col gap-3">
                <h2 className="font-display text-display-md md:text-display-lg text-background leading-tight">
                  Letters from the atelier
                </h2>
                <p className="text-body-md text-background/70 max-w-md">
                  Seasonal collections, care guides, and quiet announcements.
                  One letter a month. No spam, ever.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="flex-1 px-4 py-3 rounded-full bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-300/40 transition-all duration-250"
                />
                <Button type="submit" size="lg" className="shrink-0">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
