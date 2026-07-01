// src/components/layout/Navbar.jsx
// Modern Flora — solid-on-scroll, single-line nav, ≤80px height, glass at top.
// Mobile menu collapses into a quiet panel.

import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

export function Navbar({ onCartOpen }) {
  const { user, isAdmin, signOut } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `relative text-body-sm font-medium tracking-wide transition-colors duration-250 ease-smooth
     ${isActive ? 'text-primary-700' : 'text-muted hover:text-foreground'}
     after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-primary-500
     after:transition-all after:duration-300 after:ease-spring
     ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-spring
        ${scrolled
          ? 'bg-surface/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent border-b border-transparent'}`}
    >
      <div className="mx-auto max-w-container px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5"
            onClick={() => setMenuOpen(false)}
            aria-label="Beauty Blooms home"
          >
            <span
              className="material-symbols-outlined icon-fill text-primary-600 transition-transform duration-500 ease-spring group-hover:rotate-12"
              style={{ fontSize: '24px' }}
              aria-hidden="true"
            >
              local_florist
            </span>
            <span className="font-display text-display-sm font-semibold tracking-tight text-foreground">
              Beauty Blooms
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <NavLink to="/catalog" className={navLinkClass}>Shop</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-full
                         text-foreground transition-colors duration-250 ease-smooth
                         hover:bg-surface-2 hover:text-primary-700
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={`Open cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }} aria-hidden="true">
                shopping_bag
              </span>
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center
                             min-w-[1.1rem] h-[1.1rem] px-1 rounded-full
                             text-body-xs font-semibold text-white bg-primary-500
                             ring-2 ring-surface"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Auth (desktop) */}
            <div className="hidden md:block">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-body-sm font-medium text-muted
                             hover:text-foreground transition-colors duration-250 ease-smooth
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="px-4 py-2 text-body-sm font-medium text-muted
                             hover:text-foreground transition-colors duration-250 ease-smooth
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full
                         text-foreground transition-colors duration-250 ease-smooth
                         hover:bg-surface-2 hover:text-primary-700
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }} aria-hidden="true">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-surface/98 backdrop-blur-md border-t border-border"
          aria-label="Mobile navigation"
        >
          <nav className="px-margin-mobile py-4 flex flex-col gap-1">
            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-md text-body-md font-medium transition-colors duration-250 ease-smooth
                 ${isActive ? 'text-primary-700 bg-primary-50' : 'text-foreground hover:bg-surface-2'}`
              }
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-md text-body-md font-medium transition-colors duration-250 ease-smooth
                   ${isActive ? 'text-primary-700 bg-primary-50' : 'text-foreground hover:bg-surface-2'}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </NavLink>
            )}
            <div className="mt-2 pt-3 border-t border-border">
              {user ? (
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false) }}
                  className="block w-full text-left px-3 py-2.5 rounded-md text-body-md font-medium text-muted hover:bg-surface-2 hover:text-foreground transition-colors duration-250 ease-smooth"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="block px-3 py-2.5 rounded-md text-body-md font-semibold text-primary-700 hover:bg-primary-50 transition-colors duration-250 ease-smooth"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
