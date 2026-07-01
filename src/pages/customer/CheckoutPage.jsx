// src/pages/customer/CheckoutPage.jsx
// Modern Flora — clean form using Input primitive, single-source fee,
// 3-step progress indicator, sticky summary.

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/hooks/useOrders'
import { formatCurrency } from '@/utils/formatCurrency'
import { DELIVERY_FEE } from '@/utils/fees'
import { Spinner } from '@/components/ui/Spinner'
import Input from '@/components/ui/Input'

const EMPTY_FORM = {
  customer_name:    '',
  customer_email:   '',
  customer_phone:   '',
  delivery_address: '',
  notes:            '',
}

const FIELD_LIMITS = {
  customer_name: 200,
  customer_email: 200,
  customer_phone: 40,
  delivery_address: 500,
  notes: 1000,
}

const STEPS = [
  { label: 'Cart',     state: 'complete' },
  { label: 'Checkout', state: 'current' },
  { label: 'Confirmed', state: 'upcoming' },
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { placeOrder } = useOrders()
  const navigate = useNavigate()

  const [form,     setForm]     = useState(EMPTY_FORM)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [fieldErr, setFieldErr] = useState({})

  if (items.length === 0) return <Navigate to="/catalog" replace />

  function handleChange(e) {
    const { name, value } = e.target
    const limit = FIELD_LIMITS[name]
    setForm(prev => ({ ...prev, [name]: limit ? value.slice(0, limit) : value }))
    if (fieldErr[name]) setFieldErr(prev => ({ ...prev, [name]: null }))
  }

  function validate() {
    const errs = {}
    const cleaned = {
      customer_name: form.customer_name.trim(),
      customer_email: form.customer_email.trim(),
      customer_phone: form.customer_phone.trim(),
      delivery_address: form.delivery_address.trim(),
      notes: form.notes.trim(),
    }

    if (!cleaned.customer_name) errs.customer_name = 'Name is required.'
    if (!cleaned.customer_email) errs.customer_email = 'Messenger name is required.'
    if (!cleaned.delivery_address) errs.delivery_address = 'Delivery address is required.'

    Object.entries(FIELD_LIMITS).forEach(([field, limit]) => {
      if (cleaned[field] && cleaned[field].length > limit) {
        errs[field] = `Must be ${limit} characters or fewer.`
      }
    })

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErr(errs); return }

    setLoading(true)
    setError(null)

    try {
      const orderPayload = {
        customer_name:    form.customer_name.trim(),
        customer_email:   form.customer_email.trim(),
        customer_phone:   form.customer_phone.trim() || null,
        delivery_address: form.delivery_address.trim(),
        notes:            form.notes.trim() || null,
      }
      if (user?.id) orderPayload.customer_id = user.id

      const order = await placeOrder(orderPayload, items)
      clearCart()
      try {
        localStorage.setItem('lastOrderId', order.id)
        if (order.tracking_token) localStorage.setItem('lastOrderToken', order.tracking_token)
        window.dispatchEvent(new Event('lastOrderIdChanged'))
      } catch {
        // Local storage is best-effort only; checkout has already succeeded.
      }
      navigate(`/orders/${order.id}?token=${order.tracking_token}`, { replace: true, state: { order } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const total = totalPrice + DELIVERY_FEE

  return (
    <div className="page-enter bg-background pt-24 md:pt-32 pb-section-y">
      <div className="mx-auto max-w-container px-margin-mobile md:px-margin-desktop">

        {/* Back link */}
        <Link
          to="/catalog"
          className="group inline-flex items-center gap-2 text-body-sm text-muted hover:text-foreground transition-colors duration-250 ease-smooth mb-6"
        >
          <span
            className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-surface border border-border
                       group-hover:-translate-x-0.5 transition-transform duration-250 ease-spring"
            aria-hidden="true"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
          </span>
          Back to collection
        </Link>

        {/* Step indicator */}
        <ol className="flex items-center gap-2 mb-8 text-body-xs">
          {STEPS.map((step, i) => (
            <li key={step.label} className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-body-xs font-semibold
                  ${step.state === 'complete'
                    ? 'bg-sage-500 text-white'
                    : step.state === 'current'
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-2 text-subtle border border-border'
                  }`}
                aria-current={step.state === 'current' ? 'step' : undefined}
              >
                {step.state === 'complete' ? (
                  <span className="material-symbols-outlined icon-fill" style={{ fontSize: '14px' }} aria-hidden="true">check</span>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={step.state === 'current' ? 'text-foreground font-medium' : 'text-subtle'}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="w-8 h-px bg-border mx-1" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        <div className="mb-10">
          <p className="eyebrow-strip mb-3"><span>Almost there</span></p>
          <h1 className="font-display text-display-lg md:text-display-xl text-foreground tracking-tight leading-[1.1]">
            Secure checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-5">

          {/* Delivery form */}
          <form onSubmit={handleSubmit} noValidate className="w-full lg:col-span-3 space-y-6">
            <div className="card p-6 md:p-8 space-y-6">
              <h2 className="text-eyebrow uppercase tracking-eyebrow text-foreground">Recipient information</h2>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg px-4 py-3 text-body-sm text-error-fg bg-error-soft border border-error/20"
                >
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="co-customer_name"
                  name="customer_name"
                  label="Full name"
                  type="text"
                  required
                  placeholder="Maria Santos"
                  value={form.customer_name}
                  onChange={handleChange}
                  maxLength={FIELD_LIMITS.customer_name}
                  error={fieldErr.customer_name}
                />
                <Input
                  id="co-customer_email"
                  name="customer_email"
                  label="Messenger name"
                  hint="For order updates via Messenger"
                  type="text"
                  required
                  placeholder="maria.santos"
                  value={form.customer_email}
                  onChange={handleChange}
                  maxLength={FIELD_LIMITS.customer_email}
                  error={fieldErr.customer_email}
                />
              </div>

              <Input
                id="co-customer_phone"
                name="customer_phone"
                label="Phone (optional)"
                type="tel"
                placeholder="+63 9XX XXX XXXX"
                value={form.customer_phone}
                onChange={handleChange}
                maxLength={FIELD_LIMITS.customer_phone}
                iconLeft="call"
              />
            </div>

            <div className="card p-6 md:p-8 space-y-5">
              <h2 className="text-eyebrow uppercase tracking-eyebrow text-foreground">Delivery address</h2>

              <Input
                id="co-address"
                name="delivery_address"
                label="Complete address"
                as="textarea"
                rows={3}
                required
                placeholder="House/unit no., street, barangay, city"
                value={form.delivery_address}
                onChange={handleChange}
                maxLength={FIELD_LIMITS.delivery_address}
                error={fieldErr.delivery_address}
              />

              <Input
                id="co-notes"
                name="notes"
                label="Delivery notes (optional)"
                as="textarea"
                rows={2}
                placeholder="Any special instructions, e.g. ribbon color preference, card message…"
                value={form.notes}
                onChange={handleChange}
                maxLength={FIELD_LIMITS.notes}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center py-4 text-body-md"
              disabled={loading}
            >
              {loading
                ? <><Spinner size="sm" /> Placing order…</>
                : `Place order · ${formatCurrency(total)}`
              }
            </button>
          </form>

          {/* Order summary */}
          <aside className="w-full lg:col-span-2" aria-label="Order summary">
            <div className="card p-6 md:p-8 lg:sticky lg:top-32">
              <h2 className="text-eyebrow uppercase tracking-eyebrow text-foreground mb-5">Order summary</h2>

              <ul className="space-y-3 mb-6">
                {items.map(item => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 text-body-sm"
                  >
                    <span className="inline-flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-surface-2 text-body-xs font-semibold text-muted tabular-nums">
                      {item.quantity}
                    </span>
                    <span className="min-w-0 flex-1 text-foreground truncate">{item.name}</span>
                    <span className="price text-price-sm text-foreground shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2.5 pt-5 border-t border-border text-body-sm">
                <div className="flex justify-between items-center text-muted">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-muted">
                  <span>Delivery fee</span>
                  <span className="text-foreground">{formatCurrency(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-border">
                  <span className="font-display text-display-sm font-semibold text-foreground">Total</span>
                  <span className="price text-price-lg text-primary-700">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <p className="text-center text-body-xs text-subtle mt-5">
                Payment collected upon delivery.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
