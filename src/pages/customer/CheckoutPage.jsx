// src/pages/customer/CheckoutPage.jsx

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/hooks/useOrders'
import { formatCurrency } from '@/utils/formatCurrency'
import { Spinner } from '@/components/ui/Spinner'

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

  const DELIVERY_FEE = 80

  const glassCard = "glass-panel rounded-2xl"

  return (
    <div className="page-enter mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-12 md:py-16">
      <Link
        to="/catalog"
        className="group mb-7 inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary sm:mb-10"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full transition-all group-hover:-translate-x-1 border border-outline-variant bg-surface/80">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </span>
        Back to Collection
      </Link>

      <div className="mb-7 sm:mb-10">
        <p className="font-label-md text-label-md uppercase tracking-widest text-primary mb-2">Almost there</p>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-5">
        {/* Delivery form */}
        <form onSubmit={handleSubmit} noValidate className="w-full lg:col-span-3 space-y-8">
          <div className={`p-6 md:p-8 space-y-6 ${glassCard}`}>
            <h2 className="font-label-md text-label-md text-secondary uppercase tracking-widest">Recipient Information</h2>

            {error && (
              <div role="alert" className="rounded-lg px-4 py-3 text-sm text-on-error-container bg-error-container/50 border border-error/20">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'customer_name',  label: 'Full name',       type: 'text', required: true,  placeholder: 'Maria Santos' },
                { id: 'customer_email', label: 'Messenger name',  type: 'text', required: true,  placeholder: 'maria.santos' },
              ].map(field => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={`co-${field.id}`} className="font-label-md text-label-md text-on-surface block">
                    {field.label}
                    {field.required && <span aria-hidden="true" className="text-error ml-0.5">*</span>}
                  </label>
                  <input
                    id={`co-${field.id}`}
                    name={field.id}
                    type={field.type}
                    value={form[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    maxLength={FIELD_LIMITS[field.id]}
                    required={field.required}
                    className={`input-field ${fieldErr[field.id] ? 'border-error/50' : ''}`}
                  />
                  {fieldErr[field.id] && (
                    <p role="alert" className="text-xs text-error">{fieldErr[field.id]}</p>
                  )}
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="co-customer_phone" className="font-label-md text-label-md text-on-surface block">
                  Phone (optional)
                </label>
                <input
                  id="co-customer_phone"
                  name="customer_phone"
                  type="tel"
                  value={form.customer_phone}
                  onChange={handleChange}
                  placeholder="+63 9XX XXX XXXX"
                  maxLength={FIELD_LIMITS.customer_phone}
                  className="input-field"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-secondary/10 space-y-6">
              <h3 className="font-label-md text-label-md text-secondary uppercase tracking-widest">Delivery Address</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="co-address" className="font-label-md text-label-md text-on-surface block">
                    Complete Address <span aria-hidden="true" className="text-error">*</span>
                  </label>
                  <textarea
                    id="co-address" name="delivery_address" rows={3}
                    value={form.delivery_address} onChange={handleChange}
                    placeholder="House/unit no., street, barangay, city"
                    maxLength={FIELD_LIMITS.delivery_address}
                    className={`input-field resize-none ${fieldErr.delivery_address ? 'border-error/50' : ''}`}
                  />
                  {fieldErr.delivery_address && (
                    <p role="alert" className="text-xs text-error">{fieldErr.delivery_address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="co-notes" className="font-label-md text-label-md text-on-surface block">Delivery Notes (Optional)</label>
                  <textarea
                    id="co-notes" name="notes" rows={2}
                    value={form.notes} onChange={handleChange}
                    placeholder="Any special instructions, e.g. ribbon color preference, card message…"
                    maxLength={FIELD_LIMITS.notes}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full justify-center py-4 bg-primary text-on-primary rounded-full font-label-md text-label-md uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
            disabled={loading}
          >
            {loading
              ? <><Spinner size="sm" /> Placing order…</>
              : `Place order · ${formatCurrency(totalPrice + DELIVERY_FEE)}`
            }
          </button>
        </form>

        {/* Order summary */}
        <aside className="w-full lg:col-span-2" aria-label="Order summary">
          <div className={`p-6 md:p-8 lg:sticky lg:top-32 ${glassCard}`}>
            <h2 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-6">Order Summary</h2>
            <ul className="space-y-4 mb-8">
              {items.map(item => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 font-body-md text-body-md"
                >
                  <span className="min-w-0 flex-1 text-on-surface-variant">
                    <span className="font-semibold text-on-surface">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="text-on-surface font-medium tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-3 pt-6 border-t border-secondary/10 font-body-md text-body-md">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Delivery Fee</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div
                className="flex justify-between items-center pt-4 font-headline-sm text-headline-sm text-primary border-t border-secondary/10"
              >
                <span>Total</span>
                <span>{formatCurrency(totalPrice + DELIVERY_FEE)}</span>
              </div>
            </div>
            <p className="text-center font-body-md text-body-md text-on-surface-variant text-sm mt-6">
              Payment collected upon delivery.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}