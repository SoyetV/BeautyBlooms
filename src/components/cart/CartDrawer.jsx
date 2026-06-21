// src/components/cart/CartDrawer.jsx

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
        className={`fixed inset-0 z-50 transition-all duration-400 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'rgba(45, 27, 46, 0.5)', backdropFilter: 'blur(6px)' }}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm flex flex-col transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(253, 242, 248, 0.85)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderLeft: '1px solid rgba(249,168,212,0.3)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(249,168,212,0.2)' }}
        >
          <div>
            <h2 className="font-display text-xl font-bold text-charcoal-900">
              Your Cart
            </h2>
            {totalItems > 0 && (
              <p className="text-xs text-charcoal-500 mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''} selected</p>
            )}
          </div>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="rounded-xl p-2 text-charcoal-400 transition-all hover:text-charcoal-700"
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(249,168,212,0.25)',
            }}
            aria-label="Close cart"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
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
            <ul className="divide-y" style={{ borderColor: 'rgba(249,168,212,0.15)' }} aria-label="Cart items">
              {items.map(item => <CartItem key={item.id} item={item} />)}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-5 py-5 space-y-3"
            style={{
              borderTop: '1px solid rgba(249,168,212,0.2)',
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Price breakdown */}
            <div
              className="rounded-2xl p-4 space-y-2"
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(249,168,212,0.2)',
              }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal-500">Subtotal</span>
                <span className="font-medium text-charcoal-800">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal-500">Delivery</span>
                <span className="font-medium text-charcoal-800">{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div
                className="flex items-center justify-between pt-2"
                style={{ borderTop: '1px solid rgba(249,168,212,0.2)' }}
              >
                <span className="font-bold text-charcoal-900">Total</span>
                <span className="font-bold text-bloom-600 text-lg">{formatCurrency(totalPrice + DELIVERY_FEE)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full justify-center py-3">
              Proceed to checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-charcoal-400 hover:text-red-500 transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}