// src/components/layout/Navbar.jsx

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
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const navLink = ({ isActive }) =>
    `text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200 ${
      isActive
        ? 'text-bloom-500'
        : 'text-charcoal-600 hover:text-bloom-500'
    }`

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'shadow-lg shadow-bloom-900/5'
          : ''
      }`}
      style={{
        background: scrolled
          ? 'rgba(253, 242, 248, 0.85)'
          : 'rgba(253, 242, 248, 0.65)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(249, 168, 212, 0.2)',
      }}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-2xl font-bold text-charcoal-900 tracking-tight group"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(192,141,75,0.15) 100%)',
              border: '1px solid rgba(236,72,153,0.2)',
            }}
            aria-hidden="true"
          >
            🌸
          </span>
          <span className="bg-clip-text" style={{
            backgroundImage: 'linear-gradient(135deg, #2d1b2e 0%, #831843 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Beauty Blooms
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8" aria-label="Main navigation">
          <NavLink to="/catalog" className={navLink}>Shop</NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={() => 'text-xs font-semibold uppercase tracking-[0.15em] text-bloom-600 hover:text-bloom-700 transition-colors'}
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={onCartOpen}
            className="relative rounded-xl p-2.5 transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(249,168,212,0.25)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            aria-label={`Open cart, ${totalItems} items`}
          >
            <svg className="h-5 w-5 text-charcoal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {totalItems > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-4.5 w-4.5 min-w-[1.1rem] items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #be185d)',
                  boxShadow: '0 2px 8px rgba(236,72,153,0.4)',
                }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Auth button (desktop) */}
          <div className="hidden sm:block">
            {user ? (
              <button onClick={handleSignOut} className="btn-secondary py-2 text-xs px-5">
                Sign out
              </button>
            ) : (
              <Link to="/admin/login" className="btn-primary py-2 text-xs px-5">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden rounded-xl p-2.5 text-charcoal-600 transition-all"
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(249,168,212,0.25)',
            }}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h16.5" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          className="sm:hidden px-4 py-4 flex flex-col gap-4"
          style={{
            background: 'rgba(253, 242, 248, 0.9)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(249,168,212,0.2)',
          }}
          aria-label="Mobile navigation"
        >
          <NavLink to="/catalog" className={navLink} onClick={() => setMenuOpen(false)}>Shop</NavLink>
          {isAdmin && <NavLink to="/admin" className={navLink} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
          {user
            ? <button onClick={handleSignOut} className="text-left text-xs font-semibold uppercase tracking-widest text-charcoal-500">Sign out</button>
            : <Link to="/admin/login" className="text-xs font-semibold uppercase tracking-widest text-bloom-600" onClick={() => setMenuOpen(false)}>Sign in</Link>
          }
        </nav>
      )}
    </header>
  )
}