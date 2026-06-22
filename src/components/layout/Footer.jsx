// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto bg-surface-container backdrop-blur-lg border-t border-outline/20">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 font-display-md text-display-md text-on-surface tracking-tight group mb-4">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110 bg-surface border border-outline/30 shadow-sm"
                aria-hidden="true"
              >
                🌸
              </span>
              Beauty Blooms
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs leading-relaxed">
              Premium, fresh-cut flowers, arranged with care and delivered to your door with elegance.
            </p>

            {/* Social icons placeholder */}
            <div className="flex gap-3 mt-5">
              {['📘', '📸', '🐦'].map((icon, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-sm cursor-pointer transition-all hover:scale-110 bg-surface/80 border border-outline/30 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-label-md text-label-md uppercase tracking-[0.2em] text-on-surface-variant mb-4">Shop</h3>
            <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
              {[
                { to: '/catalog', label: 'All Flowers' },
                { to: '/catalog?category=Roses', label: 'Roses' },
                { to: '/catalog?category=Mixed', label: 'Mixed Bouquets' },
                { to: '/catalog?category=Dried+Flowers', label: 'Dried Flowers' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-200 rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-label-md text-label-md uppercase tracking-[0.2em] text-on-surface-variant mb-4">Contact</h3>
            <ul className="space-y-3 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm bg-surface/80 border border-outline/20"
                  aria-hidden="true"
                >
                  📍
                </span>
                Bato, Leyte, Philippines
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm bg-surface/80 border border-outline/20"
                  aria-hidden="true"
                >
                  📞
                </span>
                <a href="tel:+639001234567" className="hover:text-primary transition-colors">+63 900 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm bg-surface/80 border border-outline/20"
                  aria-hidden="true"
                >
                  ✉️
                </span>
                <a href="mailto:hello@bloomflowers.ph" className="hover:text-primary transition-colors">hello@bloomflowers.ph</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-label-sm text-label-sm text-on-surface-variant border-t border-outline/20"
        >
          <p>© {new Date().getFullYear()} Beauty Blooms. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-primary">🌸</span> in Cebu City
          </p>
        </div>
      </div>
    </footer>
  )
}