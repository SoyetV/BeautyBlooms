// src/components/admin/ProductTable.jsx
// Responsive inventory table with inline Edit / Delete actions.
// On mobile, each product collapses into a card-style row.

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/formatCurrency'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'

export function ProductTable({ products, loading, error, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId,  setConfirmId]  = useState(null) // ID pending delete confirm

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  function stockBadge(count) {
    if (count === 0) return <Badge label="Out of stock" variant="outofstock" />
    if (count <= 5)  return <Badge label={`Low (${count})`} variant="lowstock" />
    return <Badge label={`${count} in stock`} variant="instock" />
  }

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center py-16" aria-live="polite" aria-busy="true">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────
  if (error) {
    return (
      <div role="alert" className="rounded-xl bg-error-container/50 px-5 py-4 text-sm text-on-error-container border border-error/20">
        Failed to load products: {error}
      </div>
    )
  }

  // ── Empty ────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <EmptyState
        icon="🌱"
        title="No products yet"
        message="Add your first flower to start building the catalog."
      />
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden" aria-label="Product inventory">
        {products.map((product, idx) => (
          <article
            key={product.id}
            className="glass-panel rounded-2xl p-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-container-highest">
                {product.image_url
                  ? <img src={product.image_url} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                  : <div className="flex h-full w-full items-center justify-center text-lg" aria-hidden="true">BB</div>
                }
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-on-surface">{product.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{product.category}</p>
                  </div>
                  <p className="shrink-0 font-label-md text-label-md tabular-nums text-on-surface">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {stockBadge(product.stock_count)}
                  <Badge
                    label={product.is_available ? 'Listed' : 'Hidden'}
                    variant={product.is_available ? 'instock' : 'default'}
                  />
                </div>
              </div>
            </div>

            {confirmId === product.id ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="btn-danger px-3 py-2 text-xs"
                >
                  {deletingId === product.id ? <Spinner size="sm" /> : 'Yes, delete'}
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="btn-secondary px-3 py-2 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="rounded-full border border-outline-variant bg-surface px-3 py-2 font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary"
                  aria-label={`Edit ${product.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmId(product.id)}
                  className="rounded-full border border-outline-variant bg-surface px-3 py-2 font-label-md text-label-md text-error transition-colors hover:border-error hover:bg-error-container/30"
                  aria-label={`Delete ${product.name}`}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="glass-panel rounded-2xl hidden overflow-x-auto md:block">
      <table className="min-w-full divide-y divide-outline-variant/30 font-body-md text-body-md" aria-label="Product inventory">
        <thead className="bg-surface-container-low/50 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
          <tr>
            <th scope="col" className="px-5 py-4 text-left">Product</th>
            <th scope="col" className="px-5 py-4 text-left hidden sm:table-cell">Category</th>
            <th scope="col" className="px-5 py-4 text-right">Price</th>
            <th scope="col" className="px-5 py-4 text-left hidden md:table-cell">Stock</th>
            <th scope="col" className="px-5 py-4 text-left hidden lg:table-cell">Status</th>
            <th scope="col" className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {products.map((product, idx) => (
            <tr key={product.id} className="group hover:bg-surface-container-highest/30 transition-colors duration-500 opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              {/* Product name + image */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-container-highest">
                    {product.image_url
                      ? <img src={product.image_url} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                      : <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary" aria-hidden="true">BB</div>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline-sm text-headline-sm text-on-surface truncate max-w-[160px]">{product.name}</p>
                    {/* Show category inline on mobile */}
                    <p className="font-body-md text-body-md text-on-surface-variant sm:hidden">{product.category}</p>
                  </div>
                </div>
              </td>

              {/* Category (hidden on mobile — shown inline above) */}
              <td className="px-4 py-3 text-on-surface-variant hidden sm:table-cell">{product.category}</td>

              {/* Price */}
              <td className="px-4 py-3 text-right font-headline-sm text-headline-sm text-secondary tabular-nums">
                {formatCurrency(product.price)}
              </td>

              {/* Stock */}
              <td className="px-4 py-3 hidden md:table-cell">
                {stockBadge(product.stock_count)}
              </td>

              {/* Availability */}
              <td className="px-4 py-3 hidden lg:table-cell">
                <Badge
                  label={product.is_available ? 'Listed' : 'Hidden'}
                  variant={product.is_available ? 'instock' : 'default'}
                />
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                {confirmId === product.id ? (
                  // Inline delete confirmation
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline">Delete?</span>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="btn-danger py-1 px-3 text-xs"
                    >
                      {deletingId === product.id ? <Spinner size="sm" /> : 'Yes, delete'}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="btn-secondary py-1 px-3 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-full border border-outline-variant bg-surface px-3 py-1 font-label-md text-label-md text-on-surface hover:border-primary hover:text-primary transition-colors"
                      aria-label={`Edit ${product.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmId(product.id)}
                      className="rounded-full border border-outline-variant bg-surface px-3 py-1 font-label-md text-label-md text-error hover:border-error hover:bg-error-container/30 transition-colors"
                      aria-label={`Delete ${product.name}`}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}