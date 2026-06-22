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
    <article className="card group flex flex-col overflow-hidden h-full">
      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
        <img
          src={imgError || !product.image_url ? PLACEHOLDER : product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {/* Category pill */}
        <span className="absolute left-3 top-3 px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface bg-surface/80 backdrop-blur-md rounded-full shadow-sm">
          {product.category}
        </span>
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-[2px]">
            <span className="font-label-md text-label-md text-on-surface tracking-wider uppercase">Sold Out</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5 bg-surface">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-title-lg text-title-lg text-on-surface line-clamp-2">
            {product.name}
          </h3>
          <span className="font-label-lg text-label-lg text-primary shrink-0">
            {formatCurrency(product.price)}
          </span>
        </div>

        {product.description && (
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4">
            {product.description}
          </p>
        )}

        {stockBadge && <div className="mt-auto pt-1 mb-4">{stockBadge}</div>}

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
          className={`mt-auto w-full px-4 py-3 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
              : adding
                ? 'bg-secondary text-on-secondary shadow-md'
                : inCart
                  ? 'bg-secondary-container text-on-secondary-container border border-secondary/20'
                  : 'bg-primary text-on-primary shadow-sm hover:shadow-md hover:scale-[1.02]'
          }`}
        >
          {adding ? (
            <>
              <span className="material-symbols-outlined text-sm">check</span>
              Added!
            </>
          ) : isOutOfStock ? (
            'Out of stock'
          ) : inCart ? (
            <>
              <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              Add another
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">shopping_cart</span>
              Add to cart
            </>
          )}
        </button>
      </div>
    </article>
  )
}
