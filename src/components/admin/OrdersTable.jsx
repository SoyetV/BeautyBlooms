// src/components/admin/OrdersTable.jsx
// Modern Flora — Card default variant per row, expanded detail panel,
// status dropdown with inline spinner, skeleton loaders during fetch.

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import { formatCurrency } from '@/utils/formatCurrency'

const ORDER_STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

function formatDate(iso) {
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(iso))
}

export function OrdersTable({ orders, loading, error, onStatusChange }) {
  const [updatingId, setUpdatingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId)
    try {
      await onStatusChange(orderId, newStatus)
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Loading ─────────────────────────────────────────
  if (loading) {
    return (
      <div aria-live="polite" aria-busy="true" className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton variant="title" />
              <Skeleton variant="text" />
            </div>
            <Skeleton variant="block" className="h-5 w-20" />
            <Skeleton variant="block" className="h-6 w-24 rounded-full" />
          </div>
        ))}
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
          <p className="font-semibold">Failed to load orders</p>
          <p className="text-body-xs mt-0.5">{error}</p>
        </div>
      </div>
    )
  }

  // ── Empty ───────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <EmptyState
        icon="receipt_long"
        title="No orders yet"
        message="Orders placed by customers will appear here in real time."
      />
    )
  }

  return (
    <ul className="space-y-3" aria-label="Recent orders">
      {orders.map((order, idx) => {
        const isExpanded = expandedId === order.id
        const isUpdating = updatingId === order.id

        return (
          <li
            key={order.id}
            className="card overflow-hidden opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 60}ms` }}
            aria-label={`Order from ${order.customer_name}`}
          >
            {/* Order header row */}
            <div
              className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-2 px-4 py-4
                         transition-colors duration-250 ease-smooth hover:bg-surface-2/40
                         sm:gap-x-4 sm:px-5
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              role="button"
              aria-expanded={isExpanded}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setExpandedId(isExpanded ? null : order.id))}
            >
              {/* Customer name + ID */}
              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-semibold text-foreground truncate">{order.customer_name}</p>
                <p className="text-body-xs text-muted font-mono">{order.id.slice(0, 8)}…</p>
              </div>

              {/* Total — right-aligned number */}
              <span className="price text-price-sm text-foreground tabular-nums">
                {formatCurrency(order.total_amount)}
              </span>

              {/* Status badge — centered */}
              <Badge label={order.status} />

              {/* Date — hidden on mobile */}
              <span className="text-body-xs text-muted hidden sm:inline tabular-nums">
                {formatDate(order.created_at)}
              </span>

              {/* Chevron */}
              <span
                className={`material-symbols-outlined text-muted transition-transform duration-250 ease-spring
                  ${isExpanded ? 'rotate-180' : ''}`}
                style={{ fontSize: '18px' }}
                aria-hidden="true"
              >
                expand_more
              </span>
            </div>

            {/* Expanded detail panel */}
            {isExpanded && (
              <div className="animate-fade-in space-y-5 border-t border-border bg-surface-2/30 px-4 py-5 sm:space-y-6 sm:px-5 sm:py-6">
                {/* Customer details */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-eyebrow uppercase tracking-eyebrow text-muted mb-2">Customer</p>
                    <p className="text-body-sm text-foreground font-medium">{order.customer_name}</p>
                    <p className="text-body-sm text-muted mt-0.5">
                      Messenger: <span className="font-mono">{order.customer_email}</span>
                    </p>
                    {order.customer_phone && (
                      <p className="text-body-sm text-muted mt-0.5">
                        <a href={`tel:${order.customer_phone}`} className="hover:text-foreground transition-colors">
                          {order.customer_phone}
                        </a>
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-eyebrow uppercase tracking-eyebrow text-muted mb-2">Delivery address</p>
                    <p className="text-body-sm text-foreground leading-relaxed">{order.delivery_address}</p>
                    {order.notes && (
                      <p className="mt-1.5 text-body-sm italic text-muted leading-relaxed">
                        Note: {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order items */}
                {order.order_items?.length > 0 && (
                  <div>
                    <p className="text-eyebrow uppercase tracking-eyebrow text-muted mb-2">Items</p>
                    <ul className="divide-y divide-border rounded-lg bg-surface border border-border">
                      {order.order_items.map(item => (
                        <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                          <span className="min-w-0 text-body-sm text-foreground">
                            <span className="font-semibold">{item.quantity}×</span> {item.product_name}
                          </span>
                          <span className="price text-price-sm text-muted tabular-nums">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Status update */}
                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label
                      htmlFor={`status-${order.id}`}
                      className="text-eyebrow uppercase tracking-eyebrow text-muted"
                    >
                      Update status
                    </label>
                    <div className="relative">
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdating}
                        className="input-field py-2 pr-9 text-body-sm sm:py-1.5 appearance-none cursor-pointer"
                        aria-label={`Change order status for ${order.customer_name}`}
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <span
                        className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none"
                        style={{ fontSize: '18px' }}
                        aria-hidden="true"
                      >
                        expand_more
                      </span>
                      {isUpdating && (
                        <div className="absolute right-9 top-1/2 -translate-y-1/2">
                          <Spinner size="sm" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-body-xs text-muted tabular-nums">
                    Placed {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
