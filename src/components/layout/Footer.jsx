// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: 'rgba(253,242,248,0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(249,168,212,0.2)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 font-display text-2xl font-bold text-charcoal-900 tracking-tight group mb-4">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(192,141,75,0.12))',
                  border: '1px solid rgba(236,72,153,0.18)',
                }}
                aria-hidden="true"
              >
                🌸
              </span>
              Beauty Blooms
            </Link>
            <p className="text-sm text-charcoal-500 max-w-xs leading-relaxed font-light">
              Premium, fresh-cut flowers, arranged with care and delivered to your door with elegance.
            </p>

            {/* Social icons placeholder */}
            <div className="flex gap-3 mt-5">
              {['📘', '📸', '🐦'].map((icon, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-sm cursor-pointer transition-all hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(249,168,212,0.25)',
                    backdropFilter: 'blur(8px)',
                  }}
                  aria-hidden="true"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400 mb-4">Shop</h3>
            <ul className="space-y-2.5 text-sm text-charcoal-500">
              {[
                { to: '/catalog', label: 'All Flowers' },
                { to: '/catalog?category=Roses', label: 'Roses' },
                { to: '/catalog?category=Mixed', label: 'Mixed Bouquets' },
                { to: '/catalog?category=Dried+Flowers', label: 'Dried Flowers' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="hover:text-bloom-500 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-bloom-400 transition-all duration-200 rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-charcoal-500">
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(249,168,212,0.2)' }}
                  aria-hidden="true"
                >
                  📍
                </span>
                Cebu City, Philippines
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(249,168,212,0.2)' }}
                  aria-hidden="true"
                >
                  📞
                </span>
                <a href="tel:+639001234567" className="hover:text-bloom-500 transition-colors">+63 900 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(249,168,212,0.2)' }}
                  aria-hidden="true"
                >
                  ✉️
                </span>
                <a href="mailto:hello@bloomflowers.ph" className="hover:text-bloom-500 transition-colors">hello@bloomflowers.ph</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-400"
          style={{ borderTop: '1px solid rgba(249,168,212,0.15)' }}
        >
          <p>© {new Date().getFullYear()} Beauty Blooms. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-bloom-400">🌸</span> in Cebu City
          </p>
        </div>
      </div>
    </footer>
  )
}