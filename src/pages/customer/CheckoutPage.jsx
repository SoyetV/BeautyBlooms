// src/pages/customer/CheckoutPage.jsx
// Collects delivery details and submits the order via useOrders.placeOrder.

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/hooks/useOrders'
import { formatCurrency } from '@/utils/formatCurrency'
import { Spinner } from '@/components/ui/Spinner'

const EMPTY_FORM = {
  customer_name:      '',
  customer_email:     '',
  customer_phone:     '',
  delivery_address:   '',
  notes:              '',
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

  // Nothing in cart → redirect to catalog
  if (items.length === 0) return <Navigate to="/catalog" replace />

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErr[name]) setFieldErr(prev => ({ ...prev, [name]: null }))
  }

  function validate() {
    const errs = {}
    if (!form.customer_name.trim())    errs.customer_name    = 'Name is required.'
    if (!form.customer_email.trim())   errs.customer_email   = 'Messenger name is required.'
    if (!form.delivery_address.trim()) errs.delivery_address = 'Delivery address is required.'
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
        total_amount:     totalPrice,
        status:           'Pending',
      }

      if (user?.id) {
        orderPayload.customer_id = user.id
      }

      const order = await placeOrder(orderPayload, items)
      clearCart()
      try {
        // Persist last order id so users can return to tracking even after
        // navigating away (useful for guests or if state wasn't forwarded).
        localStorage.setItem('lastOrderId', order.id)
        window.dispatchEvent(new Event('lastOrderIdChanged'))
      } catch (e) {
        // ignore storage failures
      }
      navigate(`/orders/${order.id}`, { replace: true, state: { order } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const DELIVERY_FEE = 80

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-bloom-500 mb-6 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to catalog
      </Link>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Delivery form */}
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 space-y-5">
          <div className="card px-5 py-5">
            <h2 className="font-semibold text-gray-900 mb-4">Delivery details</h2>

            {error && (
              <div role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {[
              { id: 'customer_name',    label: 'Full name',        type: 'text',  required: true,  placeholder: 'Maria Santos' },
              { id: 'customer_email',   label: 'Messenger name',   type: 'text',  required: true,  placeholder: 'maria.santos' },
              { id: 'customer_phone',   label: 'Phone (optional)',  type: 'tel',   required: false, placeholder: '+63 9XX XXX XXXX' },
            ].map(field => (
              <div key={field.id} className="mb-4">
                <label htmlFor={`co-${field.id}`} className="label">
                  {field.label}
                  {field.required && <span aria-hidden="true" className="text-red-500 ml-0.5">*</span>}
                </label>
                <input
                  id={`co-${field.id}`}
                  name={field.id}
                  type={field.type}
                  value={form[field.id]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={`input-field ${fieldErr[field.id] ? 'border-red-400' : ''}`}
                  aria-describedby={fieldErr[field.id] ? `co-${field.id}-err` : undefined}
                />
                {fieldErr[field.id] && (
                  <p id={`co-${field.id}-err`} role="alert" className="mt-1 text-xs text-red-600">
                    {fieldErr[field.id]}
                  </p>
                )}
              </div>
            ))}

            <div className="mb-4">
              <label htmlFor="co-address" className="label">
                Delivery address <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <textarea
                id="co-address" name="delivery_address" rows={3}
                value={form.delivery_address} onChange={handleChange}
                placeholder="House/unit no., street, barangay, city"
                className={`input-field resize-none ${fieldErr.delivery_address ? 'border-red-400' : ''}`}
                aria-describedby={fieldErr.delivery_address ? 'co-address-err' : undefined}
              />
              {fieldErr.delivery_address && (
                <p id="co-address-err" role="alert" className="mt-1 text-xs text-red-600">
                  {fieldErr.delivery_address}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="co-notes" className="label">Order notes (optional)</label>
              <textarea
                id="co-notes" name="notes" rows={2}
                value={form.notes} onChange={handleChange}
                placeholder="Any special instructions, e.g. ribbon color preference, card message…"
                className="input-field resize-none"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-base" disabled={loading}>
            {loading ? <><Spinner size="sm" /> Placing order…</> : `Place order · ${formatCurrency(totalPrice + DELIVERY_FEE)}`}
          </button>
        </form>

        {/* Order summary */}
        <aside className="lg:col-span-2" aria-label="Order summary">
          <div className="card px-5 py-5 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Order summary</h2>
            <ul className="divide-y divide-gray-100 space-y-0 mb-4">
              {items.map(item => (
                <li key={item.id} className="flex justify-between py-2.5 text-sm">
                  <span className="text-gray-700">
                    <span className="font-medium">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="text-gray-900 tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Total</span>
                <span>{formatCurrency(totalPrice + DELIVERY_FEE)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
