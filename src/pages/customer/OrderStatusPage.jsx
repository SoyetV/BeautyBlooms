// src/pages/customer/OrderStatusPage.jsx
// Modern Flora — calmer hero (no rotated watermark icon), kept 4-step timeline,
// dropped ambient blur orbs, "Need help?" CTA at bottom.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/utils/formatCurrency'

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered']

const STEP_DESCRIPTIONS = {
  'Pending': 'We have received your order and are confirming stems with the atelier.',
  'Preparing': 'Your bouquet is being hand-arranged by a florist.',
  'Out for Delivery': 'Your order is on its way. We deliver across Cebu City metro.',
  'Delivered': 'Your flowers have arrived. Thank you for choosing Beauty Blooms.',
}

function stepIndex(status) {
  const i = STATUS_STEPS.indexOf(status)
  return i === -1 ? 0 : i
}

export default function OrderStatusPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [loading,     setLoading]     = useState(true)
  const [order,       setOrder]       = useState(null)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const prevStatusRef = useRef(null)

  const loadOrder = useCallback(async () => {
    if (!supabase) {
      const lastOrderId    = localStorage.getItem('lastOrderId')
      const lastOrderToken = localStorage.getItem('lastOrderToken')
      if (id && token && lastOrderId === id && lastOrderToken === token) {
        setOrder({ id, tracking_token: token, status: 'Pending', total_amount: null, order_items: [] })
      } else {
        setOrder(null)
      }
      setLoading(false)
      return
    }

    try {
      const { data, error: rpcError } = await supabase
        .rpc('get_order_status', { p_order_id: id, p_order_token: token })
        .single()

      if (rpcError) {
        console.error('[OrderStatusPage] get_order_status:', rpcError.message)
        setOrder(null)
        setError(rpcError.message)
      } else if (!data) {
        setOrder(null)
      } else {
        prevStatusRef.current = data.status
        setOrder(data)
        setError(null)
      }
    } catch (err) {
      console.error('[OrderStatusPage] loadOrder:', err.message)
      setOrder(null)
      setError(err.message)
    } finally {
      setLoading(false)
      setLastUpdated(new Date())
    }
  }, [id, token])

  useEffect(() => {
    setLoading(true)
    loadOrder()
  }, [loadOrder])

  useEffect(() => {
    if (!supabase || !id) return
    const channelName = `order-status-${id}-${Math.random().toString(36).slice(2)}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        () => { loadOrder() }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [id, loadOrder])

  useEffect(() => {
    if (!supabase || !id) return
    const interval = setInterval(loadOrder, 30000)
    return () => clearInterval(interval)
  }, [id, loadOrder])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-32">
        <Spinner size="lg" />
      </div>
    )
  }

  const currentStep = order ? stepIndex(order.status) : 0
  const isCancelled = order?.status === 'Cancelled'
  const isDelivered = order?.status === 'Delivered'

  return (
    <div className="page-enter bg-background pt-24 md:pt-32 pb-section-y">
      <div className="mx-auto max-w-container px-margin-mobile md:px-margin-desktop">

        {/* Top bar: back link + live indicator */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/catalog"
            className="group inline-flex items-center gap-2 text-body-sm text-muted hover:text-foreground transition-colors duration-250 ease-smooth"
          >
            <span
              className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-surface border border-border
                         group-hover:-translate-x-0.5 transition-transform duration-250 ease-spring"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            </span>
            Return to shop
          </Link>

          {order && supabase && (
            <div className="flex items-center gap-2 text-body-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
              </span>
              <span className="uppercase tracking-eyebrow text-foreground font-semibold">Live</span>
              {lastUpdated && (
                <span className="text-subtle hidden sm:inline">
                  · updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </div>

        {order ? (
          <section className="max-w-4xl mx-auto mb-16 animate-fade-in-up">
            <div className="card p-6 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">

                {/* Order details */}
                <div className="flex flex-col gap-8">
                  {/* Status hero */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`inline-flex items-center justify-center h-14 w-14 rounded-full shrink-0
                        ${isCancelled
                          ? 'bg-error-soft text-error-fg'
                          : isDelivered
                            ? 'bg-sage-100 text-sage-700'
                            : 'bg-primary-50 text-primary-700'
                        }`}
                    >
                      <span
                        className="material-symbols-outlined icon-fill"
                        style={{ fontSize: '28px' }}
                        aria-hidden="true"
                      >
                        {isCancelled ? 'cancel' : isDelivered ? 'check_circle' : 'inventory_2'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h1 className="font-display text-display-md font-semibold text-foreground leading-tight">
                        {isCancelled
                          ? 'Order cancelled'
                          : isDelivered
                            ? 'Order delivered'
                            : 'Order confirmed'}
                      </h1>
                      <p className="text-body-sm text-muted mt-1">
                        Order #{id?.slice(0, 8)} · <span className="font-semibold text-foreground">{order.status}</span>
                      </p>
                    </div>
                  </div>

                  {/* Items summary */}
                  {Array.isArray(order.order_items) && order.order_items.length > 0 && (
                    <div className="bg-surface-2 rounded-lg p-5 border border-border">
                      <h2 className="text-eyebrow uppercase tracking-eyebrow text-foreground mb-3">Items</h2>
                      <ul className="space-y-2">
                        {order.order_items.map((item) => (
                          <li key={item.id} className="flex items-center justify-between gap-3 text-body-sm">
                            <span className="text-foreground">
                              <span className="font-semibold">{item.quantity}×</span> {item.product_name}
                            </span>
                            <span className="price text-price-sm text-muted">
                              {formatCurrency(Number(item.subtotal))}
                            </span>
                          </li>
                        ))}
                        {order.total_amount != null && (
                          <li className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-border">
                            <span className="font-display text-display-sm font-semibold text-foreground">Total</span>
                            <span className="price text-price-md text-primary-700">
                              {formatCurrency(Number(order.total_amount))}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Status timeline */}
                  <div>
                    <h2 className="text-eyebrow uppercase tracking-eyebrow text-foreground mb-4">Status overview</h2>
                    <ol className="relative pl-7 space-y-5 before:absolute before:inset-y-1 before:left-[9px] before:w-px before:bg-border">
                      {STATUS_STEPS.map((label, i) => {
                        const reached = !isCancelled && i <= currentStep
                        const isCurrent = !isCancelled && i === currentStep
                        return (
                          <li
                            key={label}
                            className={`relative ${reached ? '' : 'opacity-50'}`}
                          >
                            <span
                              className={`absolute -left-7 top-0.5 inline-flex items-center justify-center
                                          h-[18px] w-[18px] rounded-full border-2 border-bg z-10
                                          ${reached ? 'bg-primary-500' : 'bg-surface-2 border-border'}`}
                              aria-hidden="true"
                            >
                              {reached && (
                                <span className="material-symbols-outlined icon-fill text-white" style={{ fontSize: '10px' }}>check</span>
                              )}
                            </span>
                            {isCurrent && (
                              <span
                                className="absolute -left-7 top-0.5 h-[18px] w-[18px] rounded-full bg-primary-500 animate-ping opacity-60"
                                aria-hidden="true"
                              />
                            )}
                            <h3 className={`text-body-md font-semibold ${isCurrent ? 'text-primary-700' : reached ? 'text-foreground' : 'text-muted'}`}>
                              {label}
                            </h3>
                            <p className="text-body-xs text-subtle mt-0.5 leading-relaxed">
                              {isCurrent
                                ? STEP_DESCRIPTIONS[label]
                                : reached
                                  ? 'Completed'
                                  : 'Pending'}
                            </p>
                          </li>
                        )
                      })}
                      {isCancelled && (
                        <li className="relative">
                          <span
                            className="absolute -left-7 top-0.5 inline-flex items-center justify-center
                                        h-[18px] w-[18px] rounded-full border-2 border-bg bg-error z-10"
                            aria-hidden="true"
                          >
                            <span className="material-symbols-outlined icon-fill text-white" style={{ fontSize: '10px' }}>close</span>
                          </span>
                          <h3 className="text-body-md text-error-fg font-semibold">Cancelled</h3>
                          <p className="text-body-xs text-subtle mt-0.5">This order was cancelled. Please contact us if you have questions.</p>
                        </li>
                      )}
                    </ol>
                  </div>
                </div>

                {/* Tracking link card */}
                <TrackingLinkCard orderId={id} token={token} />
              </div>
            </div>

            {/* Need help CTA */}
            <div className="mt-8 text-center">
              <p className="text-body-sm text-muted">
                Need help with this order?{' '}
                <a
                  href="mailto:hello@beautyblooms.ph"
                  className="text-primary-700 hover:text-primary-800 font-medium underline underline-offset-4 decoration-primary-300 hover:decoration-primary-500 transition-colors duration-250 ease-smooth"
                >
                  Contact the atelier
                </a>
              </p>
            </div>
          </section>
        ) : (
          <section className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="card p-8 md:p-12 text-center flex flex-col items-center justify-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-error-soft text-error-fg mb-5">
                <span className="material-symbols-outlined icon-fill" style={{ fontSize: '28px' }} aria-hidden="true">search_off</span>
              </div>
              <h1 className="font-display text-display-md font-semibold text-foreground mb-2">Order not found</h1>
              <p className="text-body-md text-muted mb-6 max-w-md leading-relaxed">
                We couldn't locate an order with ID <strong className="text-foreground">#{id?.slice(0, 8)}</strong>
                {error ? ` (${error})` : ''}. Please check the link and try again, or contact the atelier for assistance.
              </p>
              <Link to="/catalog" className="btn-primary">
                Return to catalog
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ── Tracking link card ───────────────────────────────────────────────────
function TrackingLinkCard({ orderId, token }) {
  const [copied, setCopied] = useState(false)

  const trackingUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/orders/${orderId}?token=${token}`
  }, [orderId, token])

  async function handleCopy() {
    if (!trackingUrl) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(trackingUrl)
      } else {
        const ta = document.createElement('textarea')
        ta.value = trackingUrl
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('[TrackingLinkCard] copy failed:', err.message)
      window.prompt('Copy this link to track your order:', trackingUrl)
    }
  }

  return (
    <div className="bg-surface-2 rounded-lg p-6 border border-border flex flex-col h-full">
      <h2 className="font-display text-display-sm font-semibold text-foreground mb-3">
        Track your order
      </h2>

      <p className="text-body-sm text-muted mb-4 leading-relaxed">
        Save this link to check your order status anytime. No login required — the unique token in the URL is your receipt.
      </p>

      <a
        href={trackingUrl}
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        className="block rounded-md bg-surface border border-border px-4 py-3 mb-4
                   hover:border-primary-300 hover:bg-primary-50 transition-colors duration-250 ease-smooth group"
        title="Open this link to track your order"
      >
        <div className="flex items-start gap-2">
          <span
            className="material-symbols-outlined text-primary-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-250 ease-spring"
            style={{ fontSize: '18px' }}
            aria-hidden="true"
          >
            link
          </span>
          <span className="text-body-sm text-primary-700 break-all leading-snug">
            {trackingUrl}
          </span>
        </div>
      </a>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5
                      text-body-sm font-semibold transition-all duration-250 ease-spring
                      ${copied
                        ? 'bg-sage-500 text-white'
                        : 'btn-primary'
                      }`}
        >
          {copied ? (
            <>
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: '16px' }} aria-hidden="true">check</span>
              Copied
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">content_copy</span>
              Copy link
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Beauty Blooms order',
                text: 'Track my flower order:',
                url: trackingUrl,
              }).catch(() => { /* user cancelled */ })
            } else {
              handleCopy()
            }
          }}
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">share</span>
          Share
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-eyebrow uppercase tracking-eyebrow text-foreground mb-1.5">
          Reference token
        </p>
        <p className="font-mono text-body-xs text-subtle break-all">
          {token}
        </p>
        <p className="text-body-xs text-subtle mt-2 italic">
          If contacting support, quote this token so we can find your order quickly.
        </p>
      </div>
    </div>
  )
}
