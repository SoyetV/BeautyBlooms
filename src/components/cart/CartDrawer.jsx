// src/components/cart/CartDrawer.jsx
// Slide-in cart panel from the right edge on all screen sizes.

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

  // Focus trap: move focus into drawer when it opens
  useEffect(() => {
    if (isOpen) firstFocusRef.current?.focus()
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-gray-900">
            Your Cart
            {totalItems > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({totalItems} items)</span>
            )}
          </h2>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <EmptyState
              icon="🛒"
              title="Your cart is empty"
              message="Browse our flowers and add something beautiful."
              action={
                <button onClick={() => { onClose(); navigate('/catalog') }} className="btn-primary">
                  Shop flowers
                </button>
              }
            />
          ) : (
            <ul className="divide-y divide-gray-100" aria-label="Cart items">
              {items.map(item => <CartItem key={item.id} item={item} />)}
            </ul>
          )}
        </div>

        {/* Footer: totals + checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
            </div>
            <p className="text-xs text-gray-400">Delivery fee calculated at checkout.</p>
            <button onClick={handleCheckout} className="btn-primary w-full justify-center">
              Proceed to checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
