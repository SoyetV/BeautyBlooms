import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useOrders } from '@/hooks/useOrders'
import { formatCurrency } from '@/utils/formatCurrency'
import { Spinner } from '@/components/ui/Spinner'

const FIELD_LIMITS = {
  customer_name: 100,
  customer_email: 100,
  customer_phone: 20,
  delivery_address: 300,
  notes: 500,
}

const DELIVERY_FEE = 80

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { createOrder } = useOrders()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErr, setFieldErr] = useState({})
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    notes: '',
  })

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <h2 className="font-display text-3xl font-bold text-brand-on-surface mb-4">Your collection is empty</h2>
        <p className="text-brand-on-surface-variant font-light mb-8 max-w-sm">Please select a bouquet from our collection before proceeding to checkout.</p>
        <Link to="/catalog" className="btn-primary">
          Explore Collection
        </Link>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErr[name]) setFieldErr(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.customer_name.trim()) errs.customer_name = 'Name is required'
    if (!form.customer_email.trim()) errs.customer_email = 'Contact info is required'
    if (!form.delivery_address.trim()) errs.delivery_address = 'Address is required'
    setFieldErr(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError(null)

    try {
      const orderData = {
        ...form,
        total_amount: totalPrice + DELIVERY_FEE,
        items: items.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
        })),
      }

      const order = await createOrder(orderData)
      clearCart()
      localStorage.setItem('lastOrderId', order.id)
      localStorage.setItem('lastOrderToken', order.tracking_token)
      navigate(`/orders/${order.id}?token=${order.tracking_token}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="page-enter pt-24 pb-20 mx-auto max-w-6xl px-6">
      <div className="mb-16">
        <Link to="/catalog" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-on-surface-variant hover:text-brand-primary transition-colors">
          <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Collection
        </Link>
        <h1 className="mt-8 font-display text-4xl md:text-5xl font-bold text-brand-on-surface leading-tight">
          Secure <span className="italic font-light">Checkout</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
          <section className="card-glass p-8 space-y-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-primary flex items-center gap-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-[10px]">1</span>
              Delivery Information
            </h2>

            {error && (
              <div className="p-4 rounded-xl bg-brand-error/10 text-brand-error text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Full Name</label>
                <input
                  name="customer_name"
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="Maria Clara"
                  className={`input-field ${fieldErr.customer_name ? 'border-brand-error' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Messenger / Email</label>
                <input
                  name="customer_email"
                  type="text"
                  required
                  value={form.customer_email}
                  onChange={handleChange}
                  placeholder="mclara.24"
                  className={`input-field ${fieldErr.customer_email ? 'border-brand-error' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Phone Number</label>
              <input
                name="customer_phone"
                type="tel"
                value={form.customer_phone}
                onChange={handleChange}
                placeholder="+63 900 000 0000"
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Delivery Address</label>
              <textarea
                name="delivery_address"
                rows={3}
                required
                value={form.delivery_address}
                onChange={handleChange}
                placeholder="Complete address in Cebu..."
                className={`input-field resize-none ${fieldErr.delivery_address ? 'border-brand-error' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Gift Note (Optional)</label>
              <textarea
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                placeholder="Include a message with your bouquet..."
                className="input-field resize-none"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-3"><Spinner size="sm" /> Processing Order...</span>
            ) : (
              `Complete Collection · ${formatCurrency(totalPrice + DELIVERY_FEE)}`
            )}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
           <section className="card-glass p-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-primary flex items-center gap-4 mb-8">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-[10px]">2</span>
              Your Selection
            </h2>

            <ul className="space-y-6 mb-8">
              {items.map(item => (
                <li key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                     <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-brand-secondary/5">
                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                     </div>
                     <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-on-surface truncate">{item.name}</p>
                        <p className="text-[10px] font-medium text-brand-on-surface-variant">{item.quantity} × {formatCurrency(item.price)}</p>
                     </div>
                  </div>
                  <span className="text-xs font-bold text-brand-on-surface tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 pt-6 border-t border-brand-secondary/5">
              <div className="flex justify-between text-xs font-medium text-brand-on-surface-variant uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-brand-on-surface-variant uppercase tracking-widest">
                <span>Cebu Delivery</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-6 mt-2 border-t border-brand-secondary/5">
                <span className="font-display text-xl font-bold text-brand-on-surface">Total</span>
                <span className="font-display text-3xl font-bold text-brand-primary">{formatCurrency(totalPrice + DELIVERY_FEE)}</span>
              </div>
            </div>
          </section>

          <div className="px-4 text-center">
             <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-on-surface-variant/60">
                Secure SSL Encrypted Payment & Delivery
             </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
