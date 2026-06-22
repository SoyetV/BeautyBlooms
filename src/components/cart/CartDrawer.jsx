import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { CartItem } from './CartItem'
import { formatCurrency } from '@/utils/formatCurrency'
import { EmptyState } from '@/components/ui/EmptyState'

export function CartDrawer({ isOpen, onClose }) {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const navigate = useNavigate()
  const firstFocusRef = useRef(null)

  useEffect(() => {
    if (isOpen) firstFocusRef.current?.focus()
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

  function handleCheckout() {
    onClose()
    navigate('/checkout')
  }

  const DELIVERY_FEE = 80

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'rgba(39, 21, 40, 0.4)', backdropFilter: 'blur(4px)' }}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col transition-transform duration-700 ease-spring sm:max-w-md ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(255, 247, 250, 0.9)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          borderLeft: '1px solid rgba(139, 112, 121, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-brand-secondary/5">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-on-surface">
              Your Selection
            </h2>
            {totalItems > 0 && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mt-1">
                {totalItems} Bloom{totalItems !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="rounded-full p-2 text-brand-on-surface-variant hover:bg-white/50 transition-colors"
            aria-label="Close cart"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-none">
          {items.length === 0 ? (
            <EmptyState
              icon="🌱"
              title="Awaiting your touch"
              message="Your collection is currently empty. Discover something beautiful."
              action={
                <button onClick={() => { onClose(); navigate('/catalog') }} className="btn-primary">
                  Explore Collection
                </button>
              }
            />
          ) : (
            <ul className="space-y-6" aria-label="Cart items">
              {items.map(item => <CartItem key={item.id} item={item} />)}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-8 border-t border-brand-secondary/5 bg-white/40 backdrop-blur-md">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-brand-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-brand-on-surface-variant">
                <span>Cebu Delivery</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-brand-secondary/5">
                <span className="font-display text-lg font-bold text-brand-on-surface">Total</span>
                <span className="font-display text-2xl font-bold text-brand-primary">{formatCurrency(totalPrice + DELIVERY_FEE)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleCheckout} className="btn-primary w-full">
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/60 hover:text-brand-error transition-colors py-2"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
