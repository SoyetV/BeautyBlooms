// src/components/catalog/ProductCard.jsx

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { Badge } from '@/components/ui/Badge'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23fce7f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2260%22%3E🌸%3C/text%3E%3C/svg%3E'

export function ProductCard({ product }) {
  const { addItem, items } = useCart()
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding] = useState(false)

  const inCart = items.find(i => i.id === product.id)
  const isOutOfStock = product.stock_count === 0
  const isLowStock = product.stock_count > 0 && product.stock_count <= 5

  async function handleAddToCart() {
    if (isOutOfStock) return
    setAdding(true)
    addItem(product)
    await new Promise(r => setTimeout(r, 600))
    setAdding(false)
  }

  const stockBadge = isOutOfStock
    ? <Badge label="Out of stock" variant="outofstock" />
    : isLowStock
      ? <Badge label={`Only ${product.stock_count} left`} variant="lowstock" />
      : null

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-500 sm:rounded-3xl"
      style={{
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(236,72,153,0.15), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
        e.currentTarget.style.borderColor = 'rgba(249,168,212,0.5)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
      }}
    >
      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imgError || !product.image_url ? PLACEHOLDER : product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to top, rgba(80,7,36,0.4) 0%, transparent 60%)' }}
        />
        {/* Category pill — glass style */}
        <span
          className="absolute left-3 top-3 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-charcoal-800 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {product.category}
        </span>
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <span className="text-sm font-semibold text-charcoal-600 tracking-wider uppercase">Sold Out</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <h3 className="font-display text-base font-bold leading-tight text-charcoal-900 line-clamp-2 sm:text-lg">
            {product.name}
          </h3>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold sm:px-3 sm:text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(192,141,75,0.1))',
              border: '1px solid rgba(236,72,153,0.2)',
              color: '#be185d',
            }}
          >
            {formatCurrency(product.price)}
          </span>
        </div>

        {product.description && (
          <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {stockBadge && <div className="mt-auto pt-1">{stockBadge}</div>}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || adding}
          aria-label={
            isOutOfStock
              ? `${product.name} is out of stock`
              : inCart
                ? `Add another ${product.name} to cart`
                : `Add ${product.name} to cart`
          }
          className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            isOutOfStock
              ? 'cursor-not-allowed opacity-40'
              : ''
          }`}
          style={
            isOutOfStock ? {
              background: 'rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.08)',
              color: '#6b616e',
            } : adding ? {
              background: 'linear-gradient(135deg, #4a7c59, #3a6347)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(74,124,89,0.35)',
            } : inCart ? {
              background: 'rgba(253,242,248,0.8)',
              border: '1px solid rgba(236,72,153,0.25)',
              color: '#be185d',
              backdropFilter: 'blur(8px)',
            } : {
              background: 'linear-gradient(135deg, #ec4899, #be185d)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(236,72,153,0.35)',
            }
          }
        >
          {adding ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Added!
            </>
          ) : isOutOfStock ? (
            'Out of stock'
          ) : inCart ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add another
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Add to cart
            </>
          )}
        </button>
      </div>
    </article>
  )
}
