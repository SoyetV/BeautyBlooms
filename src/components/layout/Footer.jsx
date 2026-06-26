// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto bg-surface-container-low backdrop-blur-lg border-t border-secondary/10">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-headline-sm text-headline-sm text-primary tracking-tight transition-opacity hover:opacity-80"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface border border-secondary/20 shadow-sm"
                aria-hidden="true"
              >
                <span className="material-symbols-outlined text-primary text-lg icon-fill">local_florist</span>
              </span>
              Beauty Blooms
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Bringing the delicate beauty of nature into your everyday moments. Luxury floral design in the heart of Cebu.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-2">
              {[
                { icon: 'camera_alt', label: 'Instagram' },
                { icon: 'mail',       label: 'Email' },
                { icon: 'share',      label: 'Share' },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4">Navigation</h3>
            <ul className="flex flex-col gap-3 font-body-md text-body-md">
              {[
                { to: '/catalog', label: 'Shop All' },
                { to: '/catalog?category=Roses', label: 'Roses' },
                { to: '/catalog?category=Mixed', label: 'Mixed Bouquets' },
                { to: '/catalog?category=Dried+Flowers', label: 'Dried Flowers' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-on-surface-variant hover:text-primary transition-colors ease-in-out duration-200 flex items-center gap-1.5 group"
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
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4">Contact</h3>
            <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface/80 border border-secondary/20"
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                </span>
                Bato, Leyte, Philippines
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface/80 border border-secondary/20"
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined text-sm text-primary">call</span>
                </span>
                <a href="tel:+639001234567" className="hover:text-primary transition-colors">+63 900 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface/80 border border-secondary/20"
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined text-sm text-primary">mail</span>
                </span>
                <a href="mailto:hello@bloomflowers.ph" className="hover:text-primary transition-colors">hello@bloomflowers.ph</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-label-md text-label-sm text-on-surface-variant border-t border-secondary/10"
        >
          <p>© {new Date().getFullYear()} Beauty Blooms Cebu. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="material-symbols-outlined text-sm text-primary icon-fill">favorite</span> in Cebu City
          </p>
        </div>
      </div>
    </footer>
  )
}