import { useEffect, useMemo, useRef, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/context/CartContext'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { ProductForm } from '@/components/admin/ProductForm'

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
  // IMPORTANT: We deliberately do NOT use `setPointerCapture()` here.
  // Capturing the pointer on the track would steal click events from the
  // "View Details" / "Add to cart" buttons inside the marquee cards,
  // making them unclickable. Instead we listen on `window` during a drag.
  //
  // Drag only starts after the pointer moves past a 5px threshold, so plain
  // clicks pass through untouched. After a real drag, the next click is
  // suppressed via `handleCardClickCapture` so the user doesn't accidentally
  // trigger a button at the end of a swipe.
  const scrollRef    = useRef(null)
  const rafRef       = useRef(null)
  const dragStateRef = useRef({ startX: 0, startScrollLeft: 0, active: false, hasMoved: false, pointerId: null })
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Auto-scroll loop
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const SPEED = 35
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
  }, [isHovered])

  // ── Drag handlers ─────────────────────────────────────
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

  // ── Click guard: suppress the click right after a drag ──
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
    if (!window.confirm('Delete this product from the marquee? This will also remove it from the catalog.')) return
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

  return (
    <div className="w-full flex flex-col items-center py-12 bg-background overflow-hidden">
      <div
        className="w-full relative py-8 overflow-hidden bg-surface-container-low border-y border-secondary/10 shadow-sm backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        {products.length > 0 && (
          <div className="absolute top-2 right-4 z-20 flex items-center gap-1 font-label-md text-label-md text-on-surface-variant/60 select-none pointer-events-none">
            <span className="material-symbols-outlined text-xs">swipe</span>
            <span className="hidden sm:inline uppercase tracking-wider">Drag to browse</span>
          </div>
        )}

        <div
          ref={scrollRef}
          className={`flex gap-6 px-6 overflow-x-auto scrollbar-none select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
          onPointerDown={handlePointerDown}
          onClickCapture={handleCardClickCapture}
        >
          {marqueeItems.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="glass-panel rounded-2xl flex-shrink-0 w-72 md:w-80 overflow-hidden transition-all duration-500 hover:shadow-petal-hover hover:scale-[1.02]"
            >
              <div className="relative h-80 overflow-hidden bg-surface-container-highest">
                {product.image_url || product.image ? (
                  <img
                    src={product.image_url || product.image}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="p-5 bg-surface flex flex-col justify-between h-32">
                <h3 className="font-headline-sm text-headline-sm text-primary truncate">{product.name || product.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-body-md text-body-md font-semibold text-secondary tabular-nums">{formatCurrency(product.price)}</span>
                  <button
                    type="button"
                    onClick={() => handleViewDetails(product)}
                    className="px-4 py-2 border ring-1 ring-outline text-on-surface rounded-full font-label-md text-label-md uppercase tracking-wider hover:bg-surface-variant transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      {isAdmin && (
        <div className="w-full max-w-5xl mt-16 px-6">
          <div className="glass-panel rounded-2xl shadow-petal p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Admin: Manage Marquee</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Add, edit, or remove products featured in the scrolling marquee. Changes sync to the catalog in real time.
                </p>
              </div>
              <button onClick={handleOpenAdd} className="btn-primary">
                <Plus size={18} /> Add New Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-on-surface-variant mb-4">
                  <ImageIcon size={32} />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No products yet</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Add your first flower to start building the marquee.
                </p>
                <button onClick={handleOpenAdd} className="btn-primary">
                  <Plus size={18} /> Add your first product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="relative p-4 rounded-xl border border-outline/15 bg-surface-container-low/50 hover:bg-surface-container-low hover:border-primary/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                        {product.image_url || product.image ? (
                          <img src={product.image_url || product.image} alt={product.name || product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-on-surface truncate">{product.name || product.title}</h4>
                        <p className="text-sm text-primary font-semibold tabular-nums">{formatCurrency(product.price)}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {product.category && (
                            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">{product.category}</span>
                          )}
                          {product.stock_count === 0 ? (
                            <span className="text-[10px] uppercase tracking-wider text-error">· Out of stock</span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">· {product.stock_count} in stock</span>
                          )}
                          {!product.is_available && (
                            <span className="text-[10px] uppercase tracking-wider text-outline">· Hidden</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 bg-surface rounded-full shadow-sm text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        type="button"
                        aria-label={`Edit ${product.name || product.title}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-surface rounded-full shadow-sm text-error hover:bg-error-container/50 transition-colors"
                        type="button"
                        aria-label={`Delete ${product.name || product.title}`}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="mt-3 flex gap-2 sm:hidden">
                      <button onClick={() => handleOpenEdit(product)} className="flex-1 rounded-full border border-outline-variant bg-surface px-3 py-1.5 font-label-md text-label-md text-on-surface hover:border-primary hover:text-primary transition-colors" type="button">Edit</button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 rounded-full border border-outline-variant bg-surface px-3 py-1.5 font-label-md text-label-md text-error hover:border-error hover:bg-error-container/30 transition-colors" type="button">Delete</button>
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
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-surface-container-highest">
          {product.image_url || product.image ? (
            <img src={product.image_url || product.image} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
              <ImageIcon size={64} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium bg-primary-container/80 text-on-primary-container backdrop-blur-md">{category}</span>
            )}
            {isOutOfStock ? (
              <Badge label="Out of stock" variant="outofstock" />
            ) : isLowStock ? (
              <Badge label={`Only ${stock} left`} variant="lowstock" />
            ) : (
              <Badge label={`${stock} in stock`} variant="instock" />
            )}
          </div>

          <p className="font-body-md text-3xl font-bold text-secondary tabular-nums">{formatCurrency(price)}</p>

          {description ? (
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{description}</p>
          ) : (
            <p className="font-body-md text-body-md text-outline italic">No description available.</p>
          )}

          {inCartCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-secondary-container/30 px-3 py-2 text-sm text-on-secondary-container border border-secondary/20">
              <span className="material-symbols-outlined text-base">shopping_cart</span>
              <span>{inCartCount} in your cart</span>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock || addingToCart}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-label-md text-label-md uppercase tracking-wider transition-all duration-300 sm:w-auto ${
                isOutOfStock ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                : justAdded ? 'bg-secondary text-on-secondary shadow-md'
                : 'bg-primary text-on-primary shadow-sm hover:shadow-md hover:scale-[1.02]'
              }`}
            >
              {isOutOfStock ? <>Out of stock</>
              : addingToCart ? <><span className="material-symbols-outlined text-sm">hourglass_empty</span>Adding…</>
              : justAdded ? <><span className="material-symbols-outlined text-sm">check</span>Added to cart!</>
              : <><span className="material-symbols-outlined text-sm">shopping_cart</span>Add to cart</>}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-all duration-300 hover:text-primary sm:w-auto"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}