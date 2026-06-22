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
    `text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
      isActive
        ? 'text-brand-primary'
        : 'text-brand-on-surface/70 hover:text-brand-primary'
    }`

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-brand-secondary/10"
      style={{
        background: scrolled ? 'rgba(255, 247, 250, 0.8)' : 'rgba(255, 247, 250, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:h-20">

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-brand-on-surface"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>

        {/* Desktop Nav - Left */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/catalog" className={navLink}>The Collection</NavLink>
          <NavLink to="/catalog?category=Seasonal" className={navLink}>Seasonal</NavLink>
        </nav>

        {/* Logo - Center */}
        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl font-bold tracking-tight text-brand-on-surface"
          onClick={() => setMenuOpen(false)}
        >
          Beauty Blooms
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCartOpen}
            className="group relative p-2"
            aria-label="Cart"
          >
            <svg className="h-6 w-6 text-brand-on-surface transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin/Auth */}
          <div className="hidden items-center gap-4 md:flex">
             {isAdmin && (
              <NavLink to="/admin" className={navLink}>Admin</NavLink>
            )}
            {user ? (
              <button onClick={handleSignOut} className="text-[11px] font-semibold uppercase tracking-widest text-brand-on-surface/70 hover:text-brand-primary transition-colors">
                Sign Out
              </button>
            ) : (
              <Link to="/admin/login" className="text-[11px] font-semibold uppercase tracking-widest text-brand-on-surface/70 hover:text-brand-primary transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-brand-secondary/10 bg-brand-background/95 backdrop-blur-xl px-6 py-8 flex flex-col gap-6 animate-fade-in-down">
          <NavLink to="/catalog" className={navLink} onClick={() => setMenuOpen(false)}>The Collection</NavLink>
          <NavLink to="/catalog?category=Seasonal" className={navLink} onClick={() => setMenuOpen(false)}>Seasonal</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLink} onClick={() => setMenuOpen(false)}>Admin</NavLink>
          )}
          {user ? (
            <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className={navLink + ' text-left'}>Sign Out</button>
          ) : (
            <Link to="/admin/login" className={navLink} onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </nav>
      )}
    </header>
  )
}
