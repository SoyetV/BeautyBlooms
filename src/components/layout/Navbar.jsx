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
    `font-body-lg text-body-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      isActive
        ? 'text-primary border-b-2 border-primary pb-1'
        : 'text-on-surface-variant hover:text-primary hover:opacity-80'
    }`

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        scrolled
          ? 'bg-white/70 shadow-md border-b border-secondary/20 backdrop-blur-xl'
          : 'bg-white/40 shadow-sm border-b border-secondary/20 backdrop-blur-xl'
      }`}
      id="navbar"
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-headline-md text-headline-md text-primary tracking-tight transition-opacity hover:opacity-80"
            onClick={() => setMenuOpen(false)}
          >
            Beauty Blooms
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <NavLink to="/catalog" className={navLink}>Shop</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLink}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Cart button */}
          <button
            onClick={onCartOpen}
            className="relative text-primary hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-surface-variant/50"
            aria-label={`Open cart, ${totalItems} items`}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {totalItems > 0 && (
              <span
                className="absolute right-0 top-0 flex h-4.5 w-4.5 min-w-[1.1rem] items-center justify-center rounded-full text-[10px] font-bold bg-primary text-on-primary px-1"
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Auth button (desktop) */}
          <div className="hidden md:block font-body-md text-body-md">
            {user ? (
              <button onClick={handleSignOut} className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80">
                Sign out
              </button>
            ) : (
              <Link to="/admin/login" className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="text-primary hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-surface-variant/50 md:hidden"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="flex flex-col gap-4 px-margin-mobile pb-6 pt-2 bg-white/95 backdrop-blur-xl border-t border-secondary/20 md:hidden shadow-lg"
          aria-label="Mobile navigation"
        >
          <NavLink to="/catalog" className={({ isActive }) => `${navLink({ isActive })} block`} onClick={() => setMenuOpen(false)}>Shop</NavLink>
          {isAdmin && <NavLink to="/admin" className={({ isActive }) => `${navLink({ isActive })} block`} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
          <div className="pt-2 border-t border-secondary/10">
            {user
              ? <button onClick={handleSignOut} className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 font-body-md text-body-md block w-full text-left">Sign out</button>
              : <Link to="/admin/login" className="text-primary font-body-md text-body-md font-semibold block" onClick={() => setMenuOpen(false)}>Sign in</Link>
            }
          </div>
        </div>
      )}
    </nav>
  )
}