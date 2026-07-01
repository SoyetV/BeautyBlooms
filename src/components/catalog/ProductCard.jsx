// src/components/catalog/ProductCard.jsx
// Modern Flora — opaque card, image-first, hover quick-add overlay.

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { Badge } from '@/components/ui/Badge'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23F6F1E9%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2260%22%3E🌸%3C/text%3E%3C/svg%3E'

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
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        <img
          src={imgError || !product.image_url ? PLACEHOLDER : product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <span className="px-4 py-1.5 rounded-full bg-foreground/90 text-background text-eyebrow uppercase tracking-eyebrow">
              Sold out
            </span>
          </div>
        )}

        {/* Hover quick-add (desktop) */}
        {!isOutOfStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-spring hidden sm:block">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              aria-label={
                inCart
                  ? `Add another ${product.name} to cart`
                  : `Add ${product.name} to cart`
              }
              className="w-full px-4 py-2.5 rounded-full bg-surface text-foreground font-semibold text-body-sm
                         shadow-lg border border-border
                         hover:bg-primary-500 hover:text-white hover:border-primary-500
                         active:scale-[0.98]
                         transition-all duration-250 ease-spring
                         flex items-center justify-center gap-2"
            >
              {adding ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-foreground/40 border-t-foreground" />
                  Adding…
                </>
              ) : inCart ? (
                <>
                  <span className="material-symbols-outlined icon-fill" style={{ fontSize: '16px' }} aria-hidden="true">check</span>
                  In cart · Add another
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">add</span>
                  Quick add
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 gap-2">
        {/* Category (as text label, NOT overlaid on image — taste-skill §14) */}
        <p className="text-eyebrow uppercase tracking-eyebrow text-subtle">
          {product.category}
        </p>

        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-display-sm font-semibold text-foreground leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="price text-price-md shrink-0 mt-0.5">
            {formatCurrency(product.price)}
          </p>
        </div>

        {product.description && (
          <p className="text-body-sm text-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {stockBadge && (
          <div className="pt-1">{stockBadge}</div>
        )}

        {/* Mobile add-to-cart (always visible, hover-disabled) */}
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
          className={`sm:hidden mt-2 w-full px-4 py-2.5 rounded-full font-semibold text-body-sm
                      transition-all duration-250 ease-spring
                      flex items-center justify-center gap-2
                      ${isOutOfStock
                        ? 'bg-surface-2 text-subtle cursor-not-allowed'
                        : adding
                          ? 'bg-sage-500 text-white'
                          : inCart
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'btn-primary'
                      }`}
        >
          {adding ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Adding…
            </>
          ) : isOutOfStock ? (
            'Out of stock'
          ) : inCart ? (
            <>
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: '16px' }} aria-hidden="true">check</span>
              In cart
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">add</span>
              Add to cart
            </>
          )}
        </button>
      </div>
    </article>
  )
}
