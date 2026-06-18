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
      <div role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
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
    <div className="overflow-x-auto card">
      <table className="min-w-full divide-y divide-gold-100 text-sm" aria-label="Product inventory">
        <thead className="bg-petal-50/80 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
          <tr>
            <th scope="col" className="px-5 py-4 text-left">Product</th>
            <th scope="col" className="px-5 py-4 text-left hidden sm:table-cell">Category</th>
            <th scope="col" className="px-5 py-4 text-right">Price</th>
            <th scope="col" className="px-5 py-4 text-left hidden md:table-cell">Stock</th>
            <th scope="col" className="px-5 py-4 text-left hidden lg:table-cell">Status</th>
            <th scope="col" className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold-50 bg-white">
          {products.map((product, idx) => (
            <tr key={product.id} className="group hover:bg-petal-50 transition-colors duration-500 opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              {/* Product name + image */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-petal-100">
                    {product.image_url
                      ? <img src={product.image_url} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                      : <div className="flex h-full w-full items-center justify-center text-lg" aria-hidden="true">🌸</div>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate max-w-[160px]">{product.name}</p>
                    {/* Show category inline on mobile */}
                    <p className="text-xs text-gray-400 sm:hidden">{product.category}</p>
                  </div>
                </div>
              </td>

              {/* Category (hidden on mobile — shown inline above) */}
              <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{product.category}</td>

              {/* Price */}
              <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums">
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
                    <span className="text-xs text-gray-500 hidden sm:inline">Delete?</span>
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
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-bloom-300 hover:text-bloom-600 transition-colors"
                      aria-label={`Edit ${product.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmId(product.id)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors"
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
  )
}
