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
  const [lastOrderId, setLastOrderId] = useState(null)

  useEffect(() => {
    function syncOrderId() {
      try {
        setLastOrderId(localStorage.getItem('lastOrderId'))
      } catch (e) {
        setLastOrderId(null)
      }
    }

    syncOrderId()

    window.addEventListener('storage', syncOrderId)
    window.addEventListener('lastOrderIdChanged', syncOrderId)

    return () => {
      window.removeEventListener('storage', syncOrderId)
      window.removeEventListener('lastOrderIdChanged', syncOrderId)
    }
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-bloom-600' : 'text-gray-600 hover:text-bloom-500'}`

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-bloom-600">
          <span className="text-2xl" aria-hidden="true">🌸</span>
          Bloom
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6" aria-label="Main navigation">
          <NavLink to="/catalog" className={navLink}>Shop</NavLink>
          {user && <NavLink to="/orders" className={navLink}>My Orders</NavLink>}
          {lastOrderId && <NavLink to={`/orders/${lastOrderId}`} className={navLink}>Track order</NavLink>}
          {isAdmin && (
            <NavLink to="/admin" className={navLink + ' !text-bloom-600 font-semibold'}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={onCartOpen}
            className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-bloom-50 hover:text-bloom-600"
            aria-label={`Open cart, ${totalItems} items`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-bloom-500 text-[10px] font-bold text-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Auth button (desktop) */}
          <div className="hidden sm:block">
            {user ? (
              <button onClick={handleSignOut} className="btn-secondary py-1.5 text-xs px-4">
                Sign out
              </button>
            ) : (
              <Link to="/admin/login" className="btn-primary py-1.5 text-xs px-4">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
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
          className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3"
          aria-label="Mobile navigation"
        >
          <NavLink to="/catalog" className={navLink} onClick={() => setMenuOpen(false)}>Shop</NavLink>
          {user && <NavLink to="/orders" className={navLink} onClick={() => setMenuOpen(false)}>My Orders</NavLink>}
          {lastOrderId && <NavLink to={`/orders/${lastOrderId}`} className={navLink} onClick={() => setMenuOpen(false)}>Track order</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navLink} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
          {user
            ? <button onClick={handleSignOut} className="text-left text-sm text-gray-600">Sign out</button>
            : <Link to="/admin/login" className="text-sm font-medium text-bloom-600" onClick={() => setMenuOpen(false)}>Sign in</Link>
          }
        </nav>
      )}
    </header>
  )
}
