// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-gold-200/50 bg-petal-50 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-charcoal-900 tracking-tight">
              <span aria-hidden="true">🌸</span> Beauty Blooms
            </Link>
            <p className="mt-4 text-sm text-charcoal-600 max-w-xs leading-relaxed font-light">
              Premium, fresh-cut flowers, arranged with care and delivered to your door with elegance.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/catalog" className="hover:text-bloom-500 transition-colors">All Flowers</Link></li>
              <li><Link to="/catalog?category=Roses" className="hover:text-bloom-500 transition-colors">Roses</Link></li>
              <li><Link to="/catalog?category=Mixed" className="hover:text-bloom-500 transition-colors">Mixed Bouquets</Link></li>
              <li><Link to="/catalog?category=Dried+Flowers" className="hover:text-bloom-500 transition-colors">Dried Flowers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📍</span> Bato, Leyte, Philippines
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📞</span>
                <a href="tel:+639001234567" className="hover:text-bloom-500 transition-colors">+63 900 123 4567</a>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">✉️</span>
                <a href="mailto:hello@bloomflowers.ph" className="hover:text-bloom-500 transition-colors">hello@bloomflowers.ph</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Bloom Flower Shop. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
