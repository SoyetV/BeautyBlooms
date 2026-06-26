// src/components/admin/OrdersTable.jsx
// Incoming orders dashboard with inline status update dropdown.

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
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

  if (loading) {
    return (
      <div className="flex justify-center py-16" aria-live="polite" aria-busy="true">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl bg-error-container/50 px-5 py-4 text-sm text-on-error-container border border-error/20">
        Failed to load orders: {error}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No orders yet"
        message="Orders placed by customers will appear here."
      />
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order, idx) => {
        const isExpanded = expandedId === order.id
        const isUpdating = updatingId === order.id

        return (
          <article
            key={order.id}
            className="glass-panel rounded-2xl overflow-hidden opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 75}ms` }}
            aria-label={`Order from ${order.customer_name}`}
          >
            {/* Order header row */}
            <div
              className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-2 px-4 py-4 transition-colors duration-500 hover:bg-surface-container-highest/30 sm:gap-x-4 sm:px-5"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              role="button"
              aria-expanded={isExpanded}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setExpandedId(isExpanded ? null : order.id)}
            >
              {/* Customer name + ID */}
              <div className="min-w-0 flex-1">
                <p className="font-headline-sm text-headline-sm text-on-surface truncate">{order.customer_name}</p>
                <p className="font-body-md text-body-md text-on-surface-variant font-mono">{order.id.slice(0, 8)}…</p>
              </div>

              {/* Total */}
              <span className="font-headline-sm text-headline-sm text-secondary tabular-nums">
                {formatCurrency(order.total_amount)}
              </span>

              {/* Status badge */}
              <Badge label={order.status} />

              {/* Date */}
              <span className="font-body-md text-body-md text-on-surface-variant hidden sm:inline">{formatDate(order.created_at)}</span>

              {/* Chevron */}
              <span
                className={`material-symbols-outlined h-4 w-4 text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                expand_more
              </span>
            </div>

            {/* Expanded detail panel */}
            {isExpanded && (
              <div className="animate-fade-in space-y-5 border-t border-outline-variant/20 bg-surface/40 px-4 py-5 sm:space-y-6 sm:px-5 sm:py-6">
                {/* Customer details */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1">Customer</p>
                    <p className="font-body-md text-body-md text-on-surface">{order.customer_name}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">Messenger: {order.customer_email}</p>
                    {order.customer_phone && <p className="font-body-md text-body-md text-on-surface-variant">{order.customer_phone}</p>}
                  </div>
                  <div>
                    <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1">Delivery address</p>
                    <p className="font-body-md text-body-md text-on-surface">{order.delivery_address}</p>
                    {order.notes && (
                      <p className="mt-1 font-body-md text-body-md italic text-on-surface-variant">Note: {order.notes}</p>
                    )}
                  </div>
                </div>

                {/* Order items */}
                {order.order_items?.length > 0 && (
                  <div>
                    <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-2">Items</p>
                    <ul className="divide-y divide-outline-variant/20 rounded-lg bg-surface ring-1 ring-outline-variant/30">
                      {order.order_items.map(item => (
                        <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2 font-body-md text-body-md">
                          <span className="min-w-0 text-on-surface">
                            <span className="font-semibold text-on-surface">{item.quantity}×</span> {item.product_name}
                          </span>
                          <span className="text-on-surface-variant tabular-nums">{formatCurrency(item.subtotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Status update */}
                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label htmlFor={`status-${order.id}`} className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                      Update status
                    </label>
                    <div className="relative">
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdating}
                        className="input-field py-2 pr-8 font-body-md text-body-md sm:py-1.5"
                        aria-label={`Change order status for ${order.customer_name}`}
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {isUpdating && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Spinner size="sm" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Placed {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}