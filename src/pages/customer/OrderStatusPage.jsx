import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'

export default function OrderStatusPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [loading, setLoading] = useState(true)
  const [validOrder, setValidOrder] = useState(false)

  useEffect(() => {
    const lastOrderId = localStorage.getItem('lastOrderId')
    const lastOrderToken = localStorage.getItem('lastOrderToken')

    if (id && token && lastOrderId === id && lastOrderToken === token) {
      setValidOrder(true)
    }

    setLoading(false)
  }, [id, token])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="page-enter mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-medium text-bloom-600 hover:text-bloom-800">
        ← Back to catalog
      </Link>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-8 sm:rounded-3xl sm:p-10">
        <h1 className="font-display text-3xl font-bold text-charcoal-900 sm:text-4xl">Order status</h1>
        <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">
          Track your order and get an update on your delivery. Use the order ID and tracking token from your confirmation email or checkout receipt.
        </p>

        {validOrder ? (
          <div className="mt-8 grid gap-4 rounded-2xl bg-bloom-50 p-4 text-gray-800 sm:mt-10 sm:gap-6 sm:rounded-3xl sm:p-8">
            <div className="rounded-2xl border border-bloom-100 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold text-charcoal-900">Order confirmed</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your order <strong>#{id}</strong> is being prepared. We’ll notify you when it’s on its way.
              </p>
            </div>
            <div className="rounded-2xl border border-bloom-100 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="text-base font-semibold text-charcoal-900">Tracking token</h3>
              <p className="mt-2 text-sm text-gray-600 break-all">{token}</p>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700 sm:mt-10 sm:p-8">
            <h2 className="text-xl font-semibold">Order not found</h2>
            <p className="mt-2 text-sm text-red-700 leading-relaxed">
              We couldn’t validate this order from your storage data. Please return to the catalog or place a new order.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
