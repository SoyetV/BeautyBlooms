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

  const glassCard = "bg-surface-container backdrop-blur-lg border border-outline/30 shadow-sm"

  return (
    <div className="page-enter mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-8 sm:py-16">
      <Link
        to="/catalog"
        className="group mb-7 inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary sm:mb-10"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full transition-all group-hover:-translate-x-1 border border-outline/30 bg-surface/80">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </span>
        Back to Collection
      </Link>

      <div className="mb-7 sm:mb-10">
        <p className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary mb-2">Almost there</p>
        <h1 className="font-display-md text-display-md text-on-surface">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Delivery form */}
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 space-y-5">
          <div className={`rounded-2xl px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6 ${glassCard}`}>
            <h2 className="font-title-lg text-title-lg text-on-surface mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full font-label-md text-label-md text-on-primary bg-primary">1</span>
              Delivery details
            </h2>

            {error && (
              <div role="alert" className="mb-5 rounded-2xl px-4 py-3 text-sm text-red-700" style={{ background: 'rgba(254,226,226,0.8)', border: '1px solid rgba(252,165,165,0.4)' }}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              {[
                { id: 'customer_name',  label: 'Full name',       type: 'text', required: true,  placeholder: 'Maria Santos' },
                { id: 'customer_email', label: 'Messenger name',  type: 'text', required: true,  placeholder: 'maria.santos' },
                { id: 'customer_phone', label: 'Phone (optional)', type: 'tel',  required: false, placeholder: '+63 9XX XXX XXXX' },
              ].map(field => (
                <div key={field.id}>
                  <label htmlFor={`co-${field.id}`} className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1 block">
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
                    className={`input-field ${fieldErr[field.id] ? 'border-red-300 ring-red-100' : ''}`}
                  />
                  {fieldErr[field.id] && (
                    <p role="alert" className="mt-1 text-xs text-red-500">{fieldErr[field.id]}</p>
                  )}
                </div>
              ))}

              <div>
                <label htmlFor="co-address" className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1 block">
                  Delivery address <span aria-hidden="true" className="text-error">*</span>
                </label>
                <textarea
                  id="co-address" name="delivery_address" rows={3}
                  value={form.delivery_address} onChange={handleChange}
                  placeholder="House/unit no., street, barangay, city"
                  maxLength={FIELD_LIMITS.delivery_address}
                  className={`input-field resize-none ${fieldErr.delivery_address ? 'border-red-300' : ''}`}
                />
                {fieldErr.delivery_address && (
                  <p role="alert" className="mt-1 text-xs text-red-500">{fieldErr.delivery_address}</p>
                )}
              </div>

              <div>
                <label htmlFor="co-notes" className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1 block">Order notes (optional)</label>
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

          <button
            type="submit"
            className="w-full justify-center py-4 bg-primary text-on-primary rounded-full font-label-lg text-label-lg uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
            disabled={loading}
          >
            {loading
              ? <><Spinner size="sm" /> Placing order…</>
              : `Place order · ${formatCurrency(totalPrice + DELIVERY_FEE)}`
            }
          </button>
        </form>

        {/* Order summary */}
        <aside className="lg:col-span-2" aria-label="Order summary">
          <div className={`rounded-2xl px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6 lg:sticky lg:top-24 ${glassCard}`}>
            <h2 className="font-title-lg text-title-lg text-on-surface mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full font-label-md text-label-md text-on-primary bg-primary">2</span>
              Order summary
            </h2>
            <ul className="space-y-0 mb-4 border-t border-outline/20">
              {items.map(item => (
                <li
                  key={item.id}
                  className="flex gap-3 py-3 font-body-sm text-body-sm border-b border-outline/10"
                >
                  <span className="min-w-0 flex-1 text-on-surface-variant">
                    <span className="font-semibold text-on-surface">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="text-on-surface font-medium tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 font-body-sm text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div
                className="flex justify-between font-title-lg text-title-lg text-on-surface pt-3 mt-2 border-t border-outline/20"
              >
                <span>Total</span>
                <span className="text-primary">{formatCurrency(totalPrice + DELIVERY_FEE)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
