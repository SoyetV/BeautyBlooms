import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { Badge } from '@/components/ui/Badge'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&w=800&q=80'

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
    ? <Badge label="Sold Out" variant="outofstock" />
    : isLowStock
      ? <Badge label="Limited Stock" variant="lowstock" />
      : null

  return (
    <article className="group flex flex-col h-full card-glass overflow-hidden">
      {/* Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={imgError || !product.image_url ? PLACEHOLDER : product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-1000 ease-spring group-hover:scale-110"
          loading="lazy"
        />

        {/* Category Chip */}
        <div className="absolute top-4 left-4">
           <span className="glass rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-on-surface">
            {product.category}
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
           <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className="btn-primary scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 shadow-2xl"
          >
            {adding ? 'Added' : inCart ? 'Add Another' : 'Add to Collection'}
          </button>
        </div>

        {/* Status Badge */}
        {stockBadge && (
          <div className="absolute bottom-4 left-4">
            {stockBadge}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-6 text-center">
        <h3 className="font-display text-lg font-bold text-brand-on-surface group-hover:text-brand-primary transition-colors duration-300">
          {product.name}
        </h3>
        <p className="mt-2 text-xs font-light text-brand-on-surface-variant line-clamp-1">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-sm font-semibold tracking-wide text-brand-on-surface">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </article>
  )
}
