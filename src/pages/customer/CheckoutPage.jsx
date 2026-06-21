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
      if (user?.id) orderPayload.customer_id = user.id

      const order = await placeOrder(orderPayload, items)
      clearCart()
      try {
        localStorage.setItem('lastOrderId', order.id)
        if (order.tracking_token) localStorage.setItem('lastOrderToken', order.tracking_token)
        window.dispatchEvent(new Event('lastOrderIdChanged'))
      } catch {}
      navigate(`/orders/${order.id}?token=${order.tracking_token}`, { replace: true, state: { order } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const DELIVERY_FEE = 80

  const glassCard = {
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
  }

  return (
    <div className="page-enter mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16">
      <Link
        to="/catalog"
        className="group mb-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-charcoal-500 transition-colors hover:text-bloom-600 sm:mb-10"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full transition-all group-hover:-translate-x-1" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(249,168,212,0.3)' }}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </span>
        Back to Collection
      </Link>

      <div className="mb-7 sm:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bloom-500 mb-2">Almost there</p>
        <h1 className="font-display text-3xl font-bold text-charcoal-900 sm:text-4xl">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Delivery form */}
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 space-y-5">
          <div className="rounded-2xl px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6" style={glassCard}>
            <h2 className="font-semibold text-charcoal-900 mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>1</span>
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
                  <label htmlFor={`co-${field.id}`} className="label">
                    {field.label}
                    {field.required && <span aria-hidden="true" className="text-bloom-500 ml-0.5">*</span>}
                  </label>
                  <input
                    id={`co-${field.id}`}
                    name={field.id}
                    type={field.type}
                    value={form[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={`input-field ${fieldErr[field.id] ? 'border-red-300 ring-red-100' : ''}`}
                  />
                  {fieldErr[field.id] && (
                    <p role="alert" className="mt-1 text-xs text-red-500">{fieldErr[field.id]}</p>
                  )}
                </div>
              ))}

              <div>
                <label htmlFor="co-address" className="label">
                  Delivery address <span aria-hidden="true" className="text-bloom-500">*</span>
                </label>
                <textarea
                  id="co-address" name="delivery_address" rows={3}
                  value={form.delivery_address} onChange={handleChange}
                  placeholder="House/unit no., street, barangay, city"
                  className={`input-field resize-none ${fieldErr.delivery_address ? 'border-red-300' : ''}`}
                />
                {fieldErr.delivery_address && (
                  <p role="alert" className="mt-1 text-xs text-red-500">{fieldErr.delivery_address}</p>
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
          </div>

          <button
            type="submit"
            className="btn-primary w-full justify-center py-4 text-sm"
            disabled={loading}
            style={{ boxShadow: '0 8px 30px rgba(236,72,153,0.35)' }}
          >
            {loading
              ? <><Spinner size="sm" /> Placing order…</>
              : `Place order · ${formatCurrency(totalPrice + DELIVERY_FEE)}`
            }
          </button>
        </form>

        {/* Order summary */}
        <aside className="lg:col-span-2" aria-label="Order summary">
          <div className="rounded-2xl px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6 lg:sticky lg:top-24" style={glassCard}>
            <h2 className="font-semibold text-charcoal-900 mb-5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>2</span>
              Order summary
            </h2>
            <ul className="space-y-0 mb-4" style={{ borderTop: '1px solid rgba(249,168,212,0.15)' }}>
              {items.map(item => (
                <li
                  key={item.id}
                  className="flex gap-3 py-3 text-sm"
                  style={{ borderBottom: '1px solid rgba(249,168,212,0.1)' }}
                >
                  <span className="min-w-0 flex-1 text-charcoal-700">
                    <span className="font-semibold text-charcoal-900">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="text-charcoal-800 font-medium tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-charcoal-500">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-charcoal-500">
                <span>Delivery</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div
                className="flex justify-between font-bold text-charcoal-900 text-base pt-3 mt-2"
                style={{ borderTop: '1px solid rgba(249,168,212,0.2)' }}
              >
                <span>Total</span>
                <span className="text-bloom-600">{formatCurrency(totalPrice + DELIVERY_FEE)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
