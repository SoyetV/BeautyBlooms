import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency } from '@/utils/formatCurrency'

const ORDER_STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

function formatDate(iso) {
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
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

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
  if (error) return <div className="p-8 text-center text-brand-error font-medium">{error}</div>
  if (orders.length === 0) return <div className="py-20 text-center text-brand-on-surface-variant font-light">Awaiting your first request.</div>

  return (
    <div className="space-y-4">
      {orders.map((order, idx) => {
        const isExpanded = expandedId === order.id
        const isUpdating = updatingId === order.id

        return (
          <article
            key={order.id}
            className="group card-glass overflow-hidden opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div
              className="flex items-center gap-6 px-6 py-5 cursor-pointer hover:bg-white/40 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-on-surface truncate">{order.customer_name}</p>
                <p className="text-[10px] font-bold text-brand-on-surface-variant/50 uppercase tracking-widest">{formatDate(order.created_at)}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-brand-on-surface tabular-nums">{formatCurrency(order.total_amount)}</p>
                <Badge label={order.status} />
              </div>

              <svg className={`h-5 w-5 text-brand-on-surface-variant/30 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            {isExpanded && (
              <div className="px-6 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-brand-secondary/5 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">Delivery Details</h4>
                    <p className="text-sm font-light text-brand-on-surface leading-relaxed">{order.delivery_address}</p>
                    <p className="text-xs font-medium text-brand-on-surface-variant mt-2">{order.customer_email} · {order.customer_phone}</p>
                  </div>
                  {order.notes && (
                    <div className="p-3 rounded-xl bg-brand-primary/5 italic text-xs text-brand-primary">
                      "{order.notes}"
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Request Selection</h4>
                  <ul className="space-y-2">
                    {order.order_items?.map(item => (
                      <li key={item.id} className="flex justify-between text-xs text-brand-on-surface">
                        <span className="font-medium">{item.quantity}× {item.product_name}</span>
                        <span className="font-bold tabular-nums">{formatCurrency(item.subtotal)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-brand-secondary/5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant block mb-2">Update Status</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={isUpdating}
                      className="input-field py-2 text-xs"
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
