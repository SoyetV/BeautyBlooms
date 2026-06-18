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
      <div role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
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
            className="card overflow-hidden opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 75}ms` }}
            aria-label={`Order from ${order.customer_name}`}
          >
            {/* Order header row */}
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 cursor-pointer hover:bg-petal-100 transition-colors duration-500"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              role="button"
              aria-expanded={isExpanded}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setExpandedId(isExpanded ? null : order.id)}
            >
              {/* Customer name + ID */}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{order.customer_name}</p>
                <p className="text-xs text-gray-400 font-mono">{order.id.slice(0, 8)}…</p>
              </div>

              {/* Total */}
              <span className="text-sm font-semibold text-gray-900 tabular-nums">
                {formatCurrency(order.total_amount)}
              </span>

              {/* Status badge */}
              <Badge label={order.status} />

              {/* Date */}
              <span className="text-xs text-gray-400 hidden sm:inline">{formatDate(order.created_at)}</span>

              {/* Chevron */}
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            {/* Expanded detail panel */}
            {isExpanded && (
              <div className="border-t border-gold-100 bg-petal-50/50 px-5 py-6 space-y-6 animate-fade-in">
                {/* Customer details */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Customer</p>
                    <p className="text-gray-700">{order.customer_name}</p>
                    <p className="text-gray-500">Messenger: {order.customer_email}</p>
                    {order.customer_phone && <p className="text-gray-500">{order.customer_phone}</p>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Delivery address</p>
                    <p className="text-gray-700">{order.delivery_address}</p>
                    {order.notes && (
                      <p className="mt-1 text-gray-400 italic text-xs">Note: {order.notes}</p>
                    )}
                  </div>
                </div>

                {/* Order items */}
                {order.order_items?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Items</p>
                    <ul className="divide-y divide-gray-100 rounded-lg bg-white ring-1 ring-gray-100">
                      {order.order_items.map(item => (
                        <li key={item.id} className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="text-gray-700">
                            <span className="font-medium text-gray-900">{item.quantity}×</span> {item.product_name}
                          </span>
                          <span className="text-gray-500 tabular-nums">{formatCurrency(item.subtotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Status update */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`status-${order.id}`} className="text-xs font-semibold uppercase text-gray-400">
                      Update status
                    </label>
                    <div className="relative">
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdating}
                        className="input-field py-1.5 pr-8 text-xs"
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

                  <p className="text-xs text-gray-400">
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
