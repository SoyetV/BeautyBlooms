import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/utils/formatCurrency'

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered']

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

  // ── Load order via the get_order_status RPC ──────────────
  // Security-definer function; verifies ownership via the tracking token,
  // so this works for both authenticated customers AND guests.
  const loadOrder = useCallback(async () => {
    if (!supabase) {
      // Degrade gracefully: fall back to localStorage so the immediate
      // post-checkout confirmation screen still works for this session.
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

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    loadOrder()
  }, [loadOrder])

  // ── Realtime subscription ────────────────────────────────
  // When the admin updates this order's status in the dashboard, Supabase
  // fires a postgres_changes event. We re-fetch the order so the customer's
  // timeline + status badge update live — no refresh required.
  useEffect(() => {
    if (!supabase || !id) return

    const channelName = `order-status-${id}-${Math.random().toString(36).slice(2)}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        () => {
          loadOrder()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, loadOrder])

  // ── Optional: also poll every 30s as a fallback ──────────
  useEffect(() => {
    if (!supabase || !id) return
    const interval = setInterval(loadOrder, 30000)
    return () => clearInterval(interval)
  }, [id, loadOrder])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-[120px]">
        <Spinner size="lg" />
      </div>
    )
  }

  const currentStep = order ? stepIndex(order.status) : 0
  const isCancelled = order?.status === 'Cancelled'

  return (
    <div className="page-enter relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop pt-[120px] pb-16">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-fixed opacity-30 blur-[100px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-secondary-fixed opacity-20 blur-[120px] pointer-events-none z-[-1]"></div>

      {/* Top bar: back link + live indicator */}
      <div className="relative z-10 mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/catalog"
          className="group inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-all group-hover:-translate-x-1 border border-outline-variant bg-surface/80 shadow-sm">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </span>
          Return to Shop
        </Link>

        {order && supabase && (
          <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="uppercase tracking-widest">Live</span>
            {lastUpdated && (
              <span className="text-xs text-outline hidden sm:inline">
                · updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </div>

      {order ? (
        <section className="relative z-10 max-w-4xl mx-auto mb-24 animate-fade-in-up">
          <div className="glass-panel rounded-[2rem] p-6 md:p-12 relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-12 -top-12 text-[200px] text-primary/5 select-none pointer-events-none transform rotate-12">local_florist</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
              {/* Order Details */}
              <div className="flex flex-col space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container text-[32px] icon-fill">
                      {isCancelled ? 'cancel' : 'check_circle'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-headline-sm text-headline-sm text-primary m-0">
                      {isCancelled ? 'Order Cancelled' : currentStep >= 3 ? 'Order Delivered' : 'Order Confirmed'}
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Order #{id?.slice(0, 8)}… • <span className="font-semibold text-on-surface">{order.status}</span>
                    </p>
                  </div>
                </div>

                {/* Items summary (if available) */}
                {Array.isArray(order.order_items) && order.order_items.length > 0 && (
                  <div className="bg-surface-container/50 rounded-xl p-6 border border-primary/10">
                    <h2 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4">Items</h2>
                    <ul className="space-y-2">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-on-surface">
                            <span className="font-semibold">{item.quantity}×</span> {item.product_name}
                          </span>
                          <span className="text-on-surface-variant tabular-nums">
                            {formatCurrency(Number(item.subtotal))}
                          </span>
                        </li>
                      ))}
                      {order.total_amount != null && (
                        <li className="flex items-center justify-between gap-3 pt-2 mt-2 border-t border-secondary/10 font-semibold">
                          <span>Total</span>
                          <span className="text-primary tabular-nums">
                            {formatCurrency(Number(order.total_amount))}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="bg-surface-container/50 rounded-xl p-6 border border-primary/10">
                  <h2 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4">Status Overview</h2>
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-surface-variant">
                    {STATUS_STEPS.map((label, i) => {
                      const reached = !isCancelled && i <= currentStep
                      const isCurrent = !isCancelled && i === currentStep
                      return (
                        <div key={label} className={`relative ${reached ? '' : 'opacity-50'}`}>
                          <div className={`absolute -left-[30px] w-4 h-4 rounded-full border-4 border-surface-container-low z-10 ${reached ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                          {isCurrent && (
                            <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-primary animate-ping opacity-75"></div>
                          )}
                          <h3 className={`font-body-md text-body-md font-semibold ${isCurrent ? 'text-primary' : reached ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                            {label}
                          </h3>
                          <p className="font-body-md text-body-md text-outline text-sm mt-1">
                            {isCurrent ? 'In progress' : reached ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                      )
                    })}
                    {isCancelled && (
                      <div className="relative">
                        <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-error border-4 border-surface-container-low z-10"></div>
                        <h3 className="font-body-md text-body-md text-error font-semibold">Cancelled</h3>
                        <p className="font-body-md text-body-md text-outline text-sm mt-1">This order was cancelled.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking link card */}
              <TrackingLinkCard orderId={id} token={token} />
            </div>
          </div>
        </section>
      ) : (
        <section className="relative z-10 max-w-2xl mx-auto animate-fade-in-up">
          <div className="bg-error-container/50 backdrop-blur-md border border-error/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-error text-[32px] icon-fill">search_off</span>
            </div>
            <h1 className="font-headline-sm text-headline-sm text-on-error-container mb-2">Order Not Found</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md">
              We couldn't locate an order with ID <strong>#{id?.slice(0, 8)}…</strong>
              {error ? ` (${error})` : ''}. Please check the link and try again, or contact our boutique for assistance.
            </p>
            <Link to="/catalog" className="bg-secondary text-on-secondary rounded-full px-6 py-2 font-label-md text-label-md hover:opacity-90 transition-opacity">
              Return to Catalog
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

// ── Tracking link card ───────────────────────────────────────────────────
// Shows the customer a full clickable URL they can save / bookmark / share
// to revisit their order status. The URL contains both the order id and the
// unique tracking token (required by the get_order_status RPC).
//
// Before: the page just showed the raw token UUID, which was useless to the
// customer — they had no way to turn it into a working URL. Now they get a
// ready-to-use link plus a Copy button.
function TrackingLinkCard({ orderId, token }) {
  const [copied, setCopied] = useState(false)

  // Build the absolute trackable URL using the current origin so it works
  // in any deployment (localhost, preview, production domain).
  const trackingUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const origin = window.location.origin
    return `${origin}/orders/${orderId}?token=${token}`
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

  function handleOpenLink() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="glass-card rounded-xl p-6 h-full flex flex-col">
      <h2 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-primary/10 pb-4">
        Track Your Order
      </h2>

      <p className="font-body-md text-body-md text-on-surface-variant mb-4">
        Save this link to check your order status anytime. No login required — the unique token in the URL is your receipt.
      </p>

      {/* The full URL — clickable + selectable */}
      <a
        href={trackingUrl}
        onClick={handleOpenLink}
        className="block rounded-lg bg-surface-container-low/70 border border-secondary/15 px-4 py-3 mb-4 hover:border-primary/40 hover:bg-surface-container-low transition-colors group"
        title="Open this link to track your order"
      >
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-base text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
            link
          </span>
          <span className="font-body-md text-body-md text-primary break-all leading-snug">
            {trackingUrl}
          </span>
        </div>
      </a>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-label-md text-label-md uppercase tracking-wider transition-all duration-300 ${
            copied
              ? 'bg-secondary text-on-secondary shadow-md'
              : 'bg-primary text-on-primary shadow-sm hover:shadow-md hover:scale-[1.02]'
          }`}
        >
          {copied ? (
            <>
              <span className="material-symbols-outlined text-sm">check</span>
              Copied!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Copy link
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Beauty Blooms Order',
                text: 'Track my flower order:',
                url: trackingUrl,
              }).catch(() => { /* user cancelled — no-op */ })
            } else {
              handleCopy()
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant border border-outline-variant hover:border-primary hover:text-primary transition-all duration-300"
        >
          <span className="material-symbols-outlined text-sm">share</span>
          Share
        </button>
      </div>

      {/* Short reference token (for support) */}
      <div className="mt-6 pt-4 border-t border-secondary/10">
        <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-1">
          Reference token
        </p>
        <p className="font-body-md text-body-md text-outline font-mono text-xs break-all">
          {token}
        </p>
        <p className="font-body-md text-body-md text-outline text-xs mt-2 italic">
          If contacting support, quote this token so we can find your order quickly.
        </p>
      </div>
    </div>
  )
}