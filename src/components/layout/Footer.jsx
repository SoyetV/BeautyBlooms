// src/components/layout/Footer.jsx
// Modern Flora — slim 3-col footer, no trust strip (moved to homepage).
// Location locked: Cebu City metro (was inconsistent Cebu/Leyte before).

import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-surface-2 border-t border-border">
      <div className="mx-auto max-w-container px-margin-mobile md:px-margin-desktop py-14 md:py-20">

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">

          {/* Brand — 5 cols */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 w-fit"
              aria-label="Beauty Blooms home"
            >
              <span
                className="material-symbols-outlined icon-fill text-primary-600 transition-transform duration-500 ease-spring group-hover:rotate-12"
                style={{ fontSize: '22px' }}
                aria-hidden="true"
              >
                local_florist
              </span>
              <span className="font-display text-display-sm font-semibold tracking-tight text-foreground">
                Beauty Blooms
              </span>
            </Link>
            <p className="text-body-md text-muted max-w-sm leading-relaxed">
              Bringing the delicate beauty of nature into your everyday moments.
              Luxury floral design in the heart of Cebu.
            </p>

            {/* Social */}
            <div className="flex gap-2 mt-2">
              {[
                { icon: 'photo_camera', label: 'Instagram', href: '#' },
                { icon: 'mail',         label: 'Email',     href: 'mailto:hello@beautyblooms.ph' },
                { icon: 'sms',          label: 'Messenger', href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full
                             bg-surface text-muted border border-border
                             hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50
                             transition-all duration-250 ease-spring
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation — 3 cols */}
          <div className="md:col-span-3">
            <h3 className="text-eyebrow uppercase tracking-eyebrow text-foreground mb-4">Shop</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { to: '/catalog',                          label: 'All Flowers' },
                { to: '/catalog?category=Roses',           label: 'Roses' },
                { to: '/catalog?category=Mixed+Bouquets',  label: 'Mixed Bouquets' },
                { to: '/catalog?category=Dried+Flowers',   label: 'Dried Flowers' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-body-md text-muted hover:text-primary-700 transition-colors duration-250 ease-smooth"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — 4 cols */}
          <div className="md:col-span-4">
            <h3 className="text-eyebrow uppercase tracking-eyebrow text-foreground mb-4">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-surface border border-border text-primary-600"
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span>
                </span>
                <span className="text-body-md text-muted leading-relaxed pt-1">
                  Cebu City, Philippines
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-surface border border-border text-primary-600"
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
                </span>
                <a
                  href="tel:+639001234567"
                  className="text-body-md text-muted hover:text-primary-700 transition-colors duration-250 ease-smooth pt-1"
                >
                  +63 900 123 4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-surface border border-border text-primary-600"
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
                </span>
                <a
                  href="mailto:hello@beautyblooms.ph"
                  className="text-body-md text-muted hover:text-primary-700 transition-colors duration-250 ease-smooth pt-1"
                >
                  hello@beautyblooms.ph
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-body-xs text-subtle">
            © {year} Beauty Blooms. All rights reserved.
          </p>
          <p className="text-body-xs text-subtle flex items-center gap-1.5">
            Hand-arranged in Cebu City
            <span
              className="material-symbols-outlined icon-fill text-primary-500"
              style={{ fontSize: '14px' }}
              aria-hidden="true"
            >
              favorite
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
