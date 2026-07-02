// src/components/ui/ProductMarquee.jsx
// Modern Flora — auto-scrolling draggable carousel.
// Two sizes: 'compact' (customer pages, small cards) and 'full' (admin, larger).
// Admin mode adds the management grid below the marquee.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/context/CartContext'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { ProductForm } from '@/components/admin/ProductForm'

// ── Inline icons (kept for admin grid hover actions) ──────────────────────
const Plus = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)
const Edit2 = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
)
const X = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
)
const ImageIcon = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
)

export default function ProductMarquee(props) {
  const hasInjection = Array.isArray(props.products)
  if (hasInjection) {
    return <ProductMarqueeInner {...props} />
  }
  return <WithOwnProducts {...props} />
}

function WithOwnProducts(props) {
  const { isAdmin = false } = props
  const local = useProducts({ adminMode: isAdmin })
  return (
    <ProductMarqueeInner
      {...props}
      products={local.products}
      onCreate={local.createProduct}
      onUpdate={local.updateProduct}
      onDelete={local.deleteProduct}
    />
  )
}

function ProductMarqueeInner({
  isAdmin = false,
  size = 'compact', // 'compact' (customer pages) or 'full' (admin)
  products,
  createProduct,
  updateProduct,
  deleteProduct,
}) {
  const { addItem, items: cartItems } = useCart()
  const [detailsProduct, setDetailsProduct] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // ── Marquee drag/swipe + auto-scroll ──────────────────────
  // Deliberately do NOT use setPointerCapture() — it would steal click events
  // from buttons inside the cards. Listen on window during a drag instead.
  const scrollRef    = useRef(null)
  const rafRef       = useRef(null)
  const dragStateRef = useRef({ startX: 0, startScrollLeft: 0, active: false, hasMoved: false, pointerId: null })
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Auto-scroll speed: slower for compact, faster for full
  const SPEED = size === 'compact' ? 25 : 35

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let lastTime = performance.now()
    const tick = (now) => {
      const dt = (now - lastTime) / 1000
      lastTime = now
      if (!dragStateRef.current.active && !isHovered) {
        container.scrollLeft += SPEED * dt
        const halfWidth = container.scrollWidth / 2
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isHovered, SPEED])

  function handlePointerDown(e) {
    const container = scrollRef.current
    if (!container) return
    if (e.button !== undefined && e.button !== 0) return
    dragStateRef.current = {
      startX: e.clientX,
      startScrollLeft: container.scrollLeft,
      active: false,
      hasMoved: false,
      pointerId: e.pointerId,
    }
  }

  function handleWindowPointerMove(e) {
    const st = dragStateRef.current
    if (st.pointerId == null) return
    const container = scrollRef.current
    if (!container) return
    const dx = e.clientX - st.startX
    if (!st.active && Math.abs(dx) > 5) {
      st.active = true
      st.hasMoved = true
      setIsDragging(true)
    }
    if (st.active) {
      container.scrollLeft = st.startScrollLeft - dx
      const halfWidth = container.scrollWidth / 2
      if (container.scrollLeft >= halfWidth) container.scrollLeft -= halfWidth
      if (container.scrollLeft < 0) container.scrollLeft += halfWidth
    }
  }

  function handleWindowPointerUp() {
    const st = dragStateRef.current
    if (st.pointerId == null) return
    dragStateRef.current = { startX: 0, startScrollLeft: 0, active: false, hasMoved: false, pointerId: null }
    setIsDragging(false)
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true })
    window.addEventListener('pointerup',   handleWindowPointerUp,   { passive: true })
    window.addEventListener('pointercancel', handleWindowPointerUp, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove)
      window.removeEventListener('pointerup',   handleWindowPointerUp)
      window.removeEventListener('pointercancel', handleWindowPointerUp)
    }
  }, [])

  function handleCardClickCapture(e) {
    if (dragStateRef.current.hasMoved) {
      e.preventDefault()
      e.stopPropagation()
      dragStateRef.current.hasMoved = false
    }
  }

  // ── Admin: ProductForm modal ──
  const [formOpen,     setFormOpen]     = useState(false)
  const [editProduct,  setEditProduct]  = useState(null)

  function handleOpenAdd() { setEditProduct(null); setFormOpen(true) }
  function handleOpenEdit(product) { setEditProduct(product); setFormOpen(true) }
  function handleCloseForm() { setFormOpen(false); setEditProduct(null) }

  async function handleFormSubmit(fields, imageFile) {
    if (editProduct) { await updateProduct(editProduct.id, fields, imageFile) }
    else { await createProduct(fields, imageFile) }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Delete this product? This will also remove it from the catalog.')) return
    try { await deleteProduct(id) }
    catch (err) {
      console.error('[ProductMarquee] deleteProduct failed:', err.message || err)
      alert(`Failed to delete product: ${err.message || err}`)
    }
  }

  function handleViewDetails(product) {
    setDetailsProduct(product)
    setJustAdded(false)
  }

  function handleCloseDetails() {
    setDetailsProduct(null)
    setJustAdded(false)
  }

  async function handleAddToCart(product) {
    if (!product) return
    setAddingToCart(true)
    addItem(product)
    await new Promise(r => setTimeout(r, 500))
    setAddingToCart(false)
    setJustAdded(true)
  }

  const marqueeItems = useMemo(() => [...products, ...products], [products])

  // ── Size variants ──
  const isCompact = size === 'compact'
  const cardWidth   = isCompact ? 'w-48 sm:w-52' : 'w-72 md:w-80'
  const imageHeight = isCompact ? 'h-32 sm:h-36' : 'h-64'
  const bodyPad     = isCompact ? 'p-3'           : 'p-4'

  if (products.length === 0 && !isAdmin) return null

  return (
    <div className={`w-full flex flex-col items-center ${isCompact ? 'py-6' : 'py-10'} bg-background overflow-hidden`}>
      <div
        className="w-full relative py-4 overflow-hidden bg-surface-2/40 border-y border-border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        {/* Drag hint */}
        {products.length > 0 && (
          <div className="absolute top-1.5 right-3 z-20 flex items-center gap-1 text-body-xs text-subtle select-none pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }} aria-hidden="true">swipe</span>
            <span className="hidden sm:inline uppercase tracking-eyebrow">Drag to browse</span>
          </div>
        )}

        <div
          ref={scrollRef}
          className={`flex ${isCompact ? 'gap-3 px-4 sm:px-6' : 'gap-4 px-6'} overflow-x-auto scrollbar-none select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
          onPointerDown={handlePointerDown}
          onClickCapture={handleCardClickCapture}
        >
          {marqueeItems.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className={`card flex-shrink-0 ${cardWidth} overflow-hidden transition-all duration-500 ease-spring hover:shadow-card-hover hover:-translate-y-1`}
            >
              {/* Image */}
              <button
                type="button"
                onClick={() => handleViewDetails(product)}
                className={`relative ${imageHeight} w-full overflow-hidden bg-surface-2 block`}
                aria-label={`View ${product.name || product.title} details`}
              >
                {product.image_url || product.image ? (
                  <img
                    src={product.image_url || product.image}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-spring hover:scale-105"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-subtle">
                    <span className="material-symbols-outlined" style={{ fontSize: isCompact ? '28px' : '40px' }} aria-hidden="true">local_florist</span>
                  </div>
                )}
              </button>

              {/* Body */}
              <div className={`${bodyPad} flex flex-col gap-1`}>
                <p className="text-body-xs uppercase tracking-eyebrow text-subtle truncate">
                  {product.category || 'Uncategorized'}
                </p>
                <h3 className={`font-display ${isCompact ? 'text-sm' : 'text-base'} font-semibold text-foreground truncate leading-snug`}>
                  {product.name || product.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className={`price ${isCompact ? 'text-price-sm' : 'text-price-md'} text-foreground`}>
                    {formatCurrency(product.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleViewDetails(product)}
                    className="text-body-xs font-medium text-primary-700 hover:text-primary-800 transition-colors duration-250 ease-smooth"
                  >
                    Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer details modal */}
      {!isAdmin && detailsProduct && (
        <ProductDetailsModal
          product={detailsProduct}
          onClose={handleCloseDetails}
          onAddToCart={handleAddToCart}
          addingToCart={addingToCart}
          justAdded={justAdded}
          inCartCount={cartItems.find(i => i.id === detailsProduct.id)?.quantity ?? 0}
        />
      )}

      {/* Admin management grid */}
      {isAdmin && (
        <div className="w-full max-w-5xl mt-10 px-4 sm:px-6">
          <div className="card p-5 md:p-7">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="font-display text-display-sm font-semibold text-foreground">
                  Manage marquee
                </h2>
                <p className="text-body-sm text-muted mt-0.5">
                  Add, edit, or remove products. Changes sync to the catalog in real time.
                </p>
              </div>
              <button onClick={handleOpenAdd} className="btn-primary">
                <Plus size={16} /> Add new product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-3">
                <span
                  className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-surface-2 text-subtle"
                  aria-hidden="true"
                >
                  <ImageIcon size={28} />
                </span>
                <h3 className="font-display text-display-sm font-semibold text-foreground">No products yet</h3>
                <p className="text-body-sm text-muted max-w-sm">
                  Add your first flower to start building the marquee.
                </p>
                <button onClick={handleOpenAdd} className="btn-primary">
                  <Plus size={16} /> Add your first product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="relative p-3 rounded-lg border border-border bg-surface hover:bg-surface-2 hover:border-primary-200 transition-all duration-250 ease-smooth group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-surface-2">
                        {product.image_url || product.image ? (
                          <img src={product.image_url || product.image} alt={product.name || product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-subtle">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }} aria-hidden="true">local_florist</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-body-sm font-semibold text-foreground truncate">{product.name || product.title}</h4>
                        <p className="price text-price-sm text-primary-700">{formatCurrency(product.price)}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {product.category && (
                            <span className="text-body-xs uppercase tracking-eyebrow text-subtle">{product.category}</span>
                          )}
                          {product.stock_count === 0 ? (
                            <span className="text-body-xs uppercase tracking-eyebrow text-error-fg">· Out of stock</span>
                          ) : (
                            <span className="text-body-xs uppercase tracking-eyebrow text-subtle">· {product.stock_count} in stock</span>
                          )}
                          {!product.is_available && (
                            <span className="text-body-xs uppercase tracking-eyebrow text-subtle">· Hidden</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-250 ease-spring">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-surface shadow-sm text-muted hover:text-primary-700 hover:bg-primary-50 transition-colors duration-250 ease-smooth"
                        type="button"
                        aria-label={`Edit ${product.name || product.title}`}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-surface shadow-sm text-muted hover:text-error-fg hover:bg-error-soft transition-colors duration-250 ease-smooth"
                        type="button"
                        aria-label={`Delete ${product.name || product.title}`}
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div className="mt-2 flex gap-2 sm:hidden">
                      <button onClick={() => handleOpenEdit(product)} className="flex-1 rounded-full border border-border bg-surface px-3 py-1.5 text-body-xs font-medium text-foreground hover:border-primary-300 hover:text-primary-700 transition-colors" type="button">Edit</button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 rounded-full border border-border bg-surface px-3 py-1.5 text-body-xs font-medium text-error-fg hover:border-error hover:bg-error-soft transition-colors" type="button">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ProductForm
        isOpen={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editProduct}
      />
    </div>
  )
}

// ── Product details modal ─────────────────────────────────────────────────
function ProductDetailsModal({ product, onClose, onAddToCart, addingToCart, justAdded, inCartCount }) {
  const name        = product.name || product.title || 'Untitled'
  const price       = Number(product.price ?? 0)
  const description = product.description
  const category    = product.category
  const stock       = Number(product.stock_count ?? 0)
  const isOutOfStock = stock === 0
  const isLowStock   = stock > 0 && stock <= 5

  return (
    <Modal isOpen={true} onClose={onClose} title={name} size="lg">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <div className="aspect-square overflow-hidden rounded-xl bg-surface-2 border border-border">
          {product.image_url || product.image ? (
            <img src={product.image_url || product.image} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-subtle">
              <span className="material-symbols-outlined" style={{ fontSize: '48px' }} aria-hidden="true">local_florist</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="tag">{category}</span>
            )}
            {isOutOfStock ? (
              <Badge label="Out of stock" variant="outofstock" />
            ) : isLowStock ? (
              <Badge label={`Only ${stock} left`} variant="lowstock" />
            ) : (
              <Badge label={`${stock} in stock`} variant="instock" />
            )}
          </div>

          <p className="price text-price-lg text-primary-700">{formatCurrency(price)}</p>

          {description ? (
            <p className="text-body-md text-muted leading-relaxed">{description}</p>
          ) : (
            <p className="text-body-md text-subtle italic">No description available.</p>
          )}

          {inCartCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-body-sm text-primary-700 border border-primary-200">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">shopping_bag</span>
              <span>{inCartCount} {inCartCount === 1 ? 'item' : 'items'} in your cart</span>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock || addingToCart}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-body-sm font-semibold uppercase tracking-eyebrow transition-all duration-250 ease-spring sm:w-auto
                ${isOutOfStock
                  ? 'bg-surface-2 text-subtle cursor-not-allowed'
                  : justAdded
                    ? 'bg-sage-500 text-white'
                    : 'btn-primary'
                }`}
              aria-busy={addingToCart || undefined}
            >
              {isOutOfStock ? <>Out of stock</>
              : addingToCart ? <><span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />Adding…</>
              : justAdded ? <><span className="material-symbols-outlined icon-fill" style={{ fontSize: '16px' }} aria-hidden="true">check</span>Added to cart</>
              : <><span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">shopping_bag</span>Add to cart</>}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-body-sm font-medium text-muted transition-colors duration-250 ease-smooth hover:text-foreground sm:w-auto"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
