// src/components/catalog/ProductCard.jsx
// Customer-facing flower card. Handles missing images, out-of-stock state,
// and provides a clear add-to-cart affordance.

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { Badge } from '@/components/ui/Badge'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23fce7f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2260%22%3E🌸%3C/text%3E%3C/svg%3E'

export function ProductCard({ product }) {
  const { addItem, items } = useCart()
  const [imgError, setImgError] = useState(false)
  const [adding,   setAdding]   = useState(false)

  const inCart     = items.find(i => i.id === product.id)
  const isOutOfStock = product.stock_count === 0
  const isLowStock   = product.stock_count > 0 && product.stock_count <= 5

  async function handleAddToCart() {
    if (isOutOfStock) return
    setAdding(true)
    addItem(product)
    // Brief visual feedback before resetting
    await new Promise(r => setTimeout(r, 600))
    setAdding(false)
  }

  const stockBadge = isOutOfStock
    ? <Badge label="Out of stock" variant="outofstock" />
    : isLowStock
      ? <Badge label={`Only ${product.stock_count} left`} variant="lowstock" />
      : null

  return (
    <article className="card group flex flex-col overflow-hidden rounded-2xl bg-white border border-gold-100 transition-all duration-500 hover:shadow-xl hover:shadow-gold-200/30 hover:-translate-y-1">
      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-petal-100">
        <img
          src={imgError || !product.image_url ? PLACEHOLDER : product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Elegant overlay on hover */}
        <div className="absolute inset-0 bg-gold-200/0 transition-colors duration-700 group-hover:bg-gold-200/10 pointer-events-none" />
        {/* Category pill */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-charcoal-800 backdrop-blur-md shadow-sm border border-white/20">
          {product.category}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-charcoal-900 leading-tight line-clamp-2">
            {product.name}
          </h3>
          <span className="shrink-0 text-lg font-semibold text-bloom-600">
            {formatCurrency(product.price)}
          </span>
        </div>

        {product.description && (
          <p className="text-sm text-charcoal-500 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        )}

        {/* Stock badge */}
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
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold uppercase tracking-wider transition-all
            ${isOutOfStock
              ? 'cursor-not-allowed bg-charcoal-100 text-charcoal-400'
              : adding
                ? 'bg-leaf-500 text-white shadow-md'
                : inCart
                  ? 'bg-petal-100 text-bloom-700 ring-1 ring-gold-200 hover:bg-gold-50'
                  : 'bg-charcoal-900 text-white hover:bg-bloom-600 shadow-md hover:shadow-bloom-500/30'
            }`}
        >
          {adding ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Added!
            </>
          ) : isOutOfStock ? (
            'Out of stock'
          ) : inCart ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add another
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
