// src/components/admin/ProductTable.jsx
// Modern Flora — Card outline variant container, table per ui-ux-pro-max spec:
// cell padding 12px 16px, row hover = light surface wash, numbers right-aligned,
// status badges centered, actions right-aligned. Skeleton loaders during fetch.

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/formatCurrency'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'

export function ProductTable({ products, loading, error, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId,  setConfirmId]  = useState(null)

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

  // ── Loading (skeleton rows) ─────────────────────────
  if (loading) {
    return (
      <div aria-live="polite" aria-busy="true">
        {/* Mobile skeleton cards */}
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4 flex gap-3">
              <Skeleton variant="block" className="h-16 w-16 rounded-lg shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton variant="title" />
                <Skeleton variant="text" />
                <div className="flex gap-2 mt-1">
                  <Skeleton variant="block" className="h-5 w-20" />
                  <Skeleton variant="block" className="h-5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop skeleton table */}
        <div className="hidden md:block">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-surface-2 px-5 py-3.5 flex gap-4 border-b border-border">
              <span className="flex-1"><Skeleton variant="text" /></span>
              <span className="w-24"><Skeleton variant="text" /></span>
              <span className="w-20"><Skeleton variant="text" /></span>
              <span className="w-24"><Skeleton variant="text" /></span>
              <span className="w-24"><Skeleton variant="text" /></span>
              <span className="w-24"><Skeleton variant="text" /></span>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex gap-4 items-center border-b border-border last:border-b-0">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton variant="block" className="h-10 w-10 rounded-md shrink-0" />
                  <Skeleton variant="text" />
                </div>
                <Skeleton variant="text" className="w-24" />
                <Skeleton variant="text" className="w-20" />
                <Skeleton variant="block" className="h-5 w-20 rounded-full" />
                <Skeleton variant="block" className="h-5 w-16 rounded-full" />
                <Skeleton variant="text" className="w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg bg-error-soft px-5 py-4 text-body-sm text-error-fg border border-error/20 flex items-start gap-3"
      >
        <span className="material-symbols-outlined icon-fill text-error-fg shrink-0 mt-0.5" style={{ fontSize: '18px' }} aria-hidden="true">error</span>
        <div>
          <p className="font-semibold">Failed to load products</p>
          <p className="text-body-xs mt-0.5">{error}</p>
        </div>
      </div>
    )
  }

  // ── Empty ───────────────────────────────────────────
  if (products.length === 0) {
    return (
      <EmptyState
        icon="eco"
        title="No products yet"
        message="Add your first flower to start building the catalog."
      />
    )
  }

  return (
    <>
      {/* Mobile — card rows */}
      <div className="space-y-3 md:hidden" aria-label="Product inventory">
        {products.map((product, idx) => (
          <article
            key={product.id}
            className="card p-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2 border border-border">
                {product.image_url
                  ? <img src={product.image_url} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                  : (
                    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                      <span className="material-symbols-outlined text-primary-300" style={{ fontSize: '20px' }}>local_florist</span>
                    </div>
                  )
                }
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-display-sm font-semibold text-foreground truncate">{product.name}</h3>
                    <p className="text-body-xs text-muted mt-0.5">{product.category}</p>
                  </div>
                  <p className="price text-price-sm text-foreground shrink-0">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {stockBadge(product.stock_count)}
                  <Badge
                    label={product.is_available ? 'Listed' : 'Hidden'}
                    variant={product.is_available ? 'instock' : 'default'}
                  />
                  {product.is_featured && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-body-xs font-medium bg-accent-50 text-accent-700 border border-accent-200"
                      title="Featured in marquee"
                    >
                      <span className="material-symbols-outlined icon-fill" style={{ fontSize: '11px' }} aria-hidden="true">star</span>
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {confirmId === product.id ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="btn-danger px-3 py-2 text-body-xs justify-center"
                >
                  {deletingId === product.id ? <Spinner size="sm" /> : 'Yes, delete'}
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="btn-secondary px-3 py-2 text-body-xs justify-center"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="btn-secondary px-3 py-2 text-body-xs justify-center"
                  aria-label={`Edit ${product.name}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }} aria-hidden="true">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => setConfirmId(product.id)}
                  className="rounded-full border border-border bg-surface px-3 py-2 text-body-xs font-medium text-error-fg
                             transition-all duration-250 ease-spring
                             hover:border-error hover:bg-error-soft
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                             inline-flex items-center justify-center gap-1.5"
                  aria-label={`Delete ${product.name}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }} aria-hidden="true">delete</span>
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Desktop — table */}
      <div className="hidden md:block border border-border rounded-xl overflow-hidden bg-surface">
        <table className="min-w-full" aria-label="Product inventory">
          <thead className="bg-surface-2 text-eyebrow uppercase tracking-eyebrow text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Product</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Category</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Price</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold hidden md:table-cell">Stock</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold hidden lg:table-cell">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product, idx) => (
              <tr
                key={product.id}
                className="group hover:bg-surface-2/50 transition-colors duration-250 ease-smooth opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Product name + image */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-surface-2 border border-border">
                      {product.image_url
                        ? <img src={product.image_url} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                        : (
                          <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                            <span className="material-symbols-outlined text-primary-300" style={{ fontSize: '16px' }}>local_florist</span>
                          </div>
                        )
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-sm font-medium text-foreground truncate max-w-[180px]">{product.name}</p>
                      {/* Show category inline on tablet */}
                      <p className="text-body-xs text-muted lg:hidden">{product.category}</p>
                    </div>
                  </div>
                </td>

                {/* Category (hidden on tablet — shown inline above) */}
                <td className="px-4 py-3 text-body-sm text-muted hidden lg:table-cell">{product.category}</td>

                {/* Price — right-aligned numbers */}
                <td className="px-4 py-3 text-right price text-price-sm text-foreground tabular-nums">
                  {formatCurrency(product.price)}
                </td>

                {/* Stock — centered badge */}
                <td className="px-4 py-3 hidden md:table-cell text-center">
                  <span className="inline-flex">{stockBadge(product.stock_count)}</span>
                </td>

                {/* Availability + Featured — centered badges */}
                <td className="px-4 py-3 hidden lg:table-cell text-center">
                  <div className="inline-flex flex-col gap-1 items-center">
                    <Badge
                      label={product.is_available ? 'Listed' : 'Hidden'}
                      variant={product.is_available ? 'instock' : 'default'}
                    />
                    {product.is_featured && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-body-xs font-medium bg-accent-50 text-accent-700 border border-accent-200"
                        title="Featured in marquee"
                      >
                        <span className="material-symbols-outlined icon-fill" style={{ fontSize: '11px' }} aria-hidden="true">star</span>
                        Featured
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions — right-aligned */}
                <td className="px-4 py-3 text-right">
                  {confirmId === product.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="btn-danger py-1.5 px-3 text-body-xs"
                      >
                        {deletingId === product.id ? <Spinner size="sm" /> : 'Yes, delete'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="btn-secondary py-1.5 px-3 text-body-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity duration-250 ease-smooth">
                      <button
                        onClick={() => onEdit(product)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full text-muted
                                   hover:text-primary-700 hover:bg-primary-50 transition-colors duration-250 ease-smooth
                                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        aria-label={`Edit ${product.name}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">edit</span>
                      </button>
                      <button
                        onClick={() => setConfirmId(product.id)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full text-muted
                                   hover:text-error-fg hover:bg-error-soft transition-colors duration-250 ease-smooth
                                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        aria-label={`Delete ${product.name}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">delete</span>
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
