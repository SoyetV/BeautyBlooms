import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-brand-surface-container-low border-t border-brand-secondary/10 pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-2xl font-bold text-brand-on-surface">
              Beauty Blooms
            </Link>
            <p className="mt-4 text-sm font-light leading-relaxed text-brand-on-surface-variant max-w-xs">
              Hand-arranged, premium bouquets crafted with the most luxurious seasonal blooms in Cebu.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-on-surface mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-light text-brand-on-surface-variant">
              <li><Link to="/catalog" className="hover:text-brand-primary transition-colors">The Collection</Link></li>
              <li><Link to="/catalog?category=Mixed" className="hover:text-brand-primary transition-colors">Mixed Bouquets</Link></li>
              <li><Link to="/catalog?category=Roses" className="hover:text-brand-primary transition-colors">Luxury Roses</Link></li>
              <li><Link to="/catalog?category=Dried" className="hover:text-brand-primary transition-colors">Everlasting Dried</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-on-surface mb-6">Client Care</h4>
            <ul className="space-y-4 text-sm font-light text-brand-on-surface-variant">
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Our Story</Link></li>
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Delivery Info</Link></li>
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Flower Care</Link></li>
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-on-surface mb-6">Stay in Bloom</h4>
            <p className="text-sm font-light text-brand-on-surface-variant mb-4">
              Join our newsletter for seasonal updates and exclusive floral curation.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/50 border border-brand-secondary/10 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary w-full"
              />
              <button className="bg-brand-primary text-white text-[10px] uppercase font-bold tracking-widest rounded-full px-4 py-2 hover:bg-brand-primary-container transition-colors shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-brand-secondary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium uppercase tracking-widest text-brand-on-surface-variant/60">
          <p>© {new Date().getFullYear()} Beauty Blooms. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
