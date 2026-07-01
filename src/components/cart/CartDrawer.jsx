// src/components/cart/CartDrawer.jsx
// Modern Flora — solid surface, redesigned item rows, single-source fee.

import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { CartItem } from './CartItem'
import { formatCurrency } from '@/utils/formatCurrency'
import { DELIVERY_FEE } from '@/utils/fees'
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ease-smooth
          ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col
                    bg-surface shadow-xl border-l border-border
                    transition-transform duration-400 ease-spring sm:max-w-md
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-display text-display-sm font-semibold text-foreground">
              Your cart
            </h2>
            {totalItems > 0 && (
              <p className="text-body-xs text-muted mt-0.5">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
              </p>
            )}
          </div>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full text-muted
                       hover:bg-surface-2 hover:text-foreground transition-colors duration-250 ease-smooth
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }} aria-hidden="true">close</span>
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <EmptyState
              icon="shopping_bag"
              title="Your cart is empty"
              message="Browse the collection and add something beautiful."
              action={
                <button
                  onClick={() => { onClose(); navigate('/catalog') }}
                  className="btn-primary"
                >
                  Shop flowers
                </button>
              }
            />
          ) : (
            <ul className="divide-y divide-border" aria-label="Cart items">
              {items.map(item => <CartItem key={item.id} item={item} />)}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-border bg-surface-2/50 space-y-3">
            {/* Price breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-muted">Delivery</span>
                <span className="font-medium text-foreground">{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
                <span className="font-display text-display-sm font-semibold text-foreground">Total</span>
                <span className="price text-price-lg text-primary-700">
                  {formatCurrency(totalPrice + DELIVERY_FEE)}
                </span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full justify-center py-3">
              Proceed to checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-center text-body-xs text-subtle hover:text-error-fg transition-colors duration-250 ease-smooth py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
