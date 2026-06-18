// src/pages/customer/OrderStatusPage.jsx
// Shows a single order's status timeline. Accessible via /orders/:orderId.

import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency } from '@/utils/formatCurrency'

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered']

export default function OrderStatusPage() {
  const { orderId } = useParams()
  const location = useLocation()
  const [order,   setOrder]   = useState(location.state?.order ?? null)
  const [loading, setLoading] = useState(order ? false : true)
  const [error,   setError]   = useState(null)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    if (order) return

    async function fetchOrder() {
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .maybeSingle()

      if (err) {
        setError(err.message)
      } else if (!data) {
        setError('Order not found.')
      } else {
        setOrder(data)
      }

      setLoading(false)
    }

    fetchOrder()
  }, [order, orderId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-4xl mb-4" aria-hidden="true">🔍</p>
        <h1 className="font-display text-xl font-semibold text-gray-900 mb-2">Order not found</h1>
        <p className="text-sm text-gray-500 mb-6">{error ?? 'We couldn\'t find that order.'}</p>
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    )
  }

  const stepIndex = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'Cancelled'

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyStatus('Link copied to clipboard')
      setTimeout(() => setCopyStatus(''), 2500)
    } catch (err) {
      setCopyStatus('Copy failed — please copy the URL manually.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl" aria-hidden="true">
          {order.status === 'Delivered' ? '🎉' : isCancelled ? '❌' : '🌸'}
        </span>
        <h1 className="font-display text-2xl font-bold text-gray-900 mt-3">
          {order.status === 'Delivered'
            ? 'Your order has arrived!'
            : isCancelled
              ? 'Order cancelled'
              : 'Your order is on its way'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">Order ID: <span className="font-mono">{order.id}</span></p>
        <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleCopyLink}
            className="btn-secondary"
          >
            Copy tracking link
          </button>
          {copyStatus && (
            <span className="text-sm text-gray-500">{copyStatus}</span>
          )}
        </div>
      </div>

      {/* Status timeline */}
      {!isCancelled && (
        <div className="mb-10" aria-label="Order progress">
          <ol className="flex items-start gap-0">
            {STATUS_STEPS.map((step, idx) => {
              const done    = idx <= stepIndex
              const current = idx === stepIndex
              const last    = idx === STATUS_STEPS.length - 1
              return (
                <li key={step} className="flex flex-1 flex-col items-center">
                  {/* Connector line + dot */}
                  <div className="flex w-full items-center">
                    {idx > 0 && (
                      <div className={`h-0.5 flex-1 transition-colors ${done ? 'bg-bloom-500' : 'bg-gray-200'}`} />
                    )}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors
                        ${done ? 'border-bloom-500 bg-bloom-500' : 'border-gray-200 bg-white'}`}
                      aria-current={current ? 'step' : undefined}
                    >
                      {done ? (
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      )}
                    </div>
                    {!last && (
                      <div className={`h-0.5 flex-1 transition-colors ${idx < stepIndex ? 'bg-bloom-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  {/* Step label */}
                  <p className={`mt-2 text-center text-xs leading-tight max-w-[60px] sm:max-w-[80px]
                    ${current ? 'font-semibold text-bloom-600' : done ? 'text-gray-500' : 'text-gray-300'}`}>
                    {step}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {/* Order details */}
      <div className="card divide-y divide-gray-100">
        {/* Delivery info */}
        <div className="px-5 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Delivery to</h2>
          <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
          <p className="text-sm text-gray-500">{order.delivery_address}</p>
          {order.notes && <p className="mt-1 text-xs text-gray-400 italic">Note: {order.notes}</p>}
        </div>

        {/* Items */}
        <div className="px-5 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Items ordered</h2>
          <ul className="space-y-2">
            {order.order_items.map(item => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  <span className="font-medium">{item.quantity}×</span> {item.product_name}
                </span>
                <span className="text-gray-900 tabular-nums">{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total + status */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total paid</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
          </div>
          <Badge label={order.status} />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/catalog" className="btn-secondary">
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
