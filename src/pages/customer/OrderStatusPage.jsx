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
    <div className="page-enter mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-8 sm:py-16">
      <Link to="/catalog" className="inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:text-primary-dark transition-colors">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to catalog
      </Link>

      <div className="mt-6 rounded-3xl bg-surface-container backdrop-blur-lg border border-outline/30 p-5 shadow-sm sm:mt-8 sm:p-10">
        <h1 className="font-display-md text-display-md text-on-surface">Order status</h1>
        <p className="mt-4 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
          Track your order and get an update on your delivery. Use the order ID and tracking token from your confirmation email or checkout receipt.
        </p>

        {validOrder ? (
          <div className="mt-8 grid gap-4 rounded-2xl bg-surface-variant/30 p-4 text-on-surface sm:mt-10 sm:gap-6 sm:rounded-3xl sm:p-8">
            <div className="rounded-2xl border border-outline/20 bg-surface/60 p-4 shadow-sm sm:p-6 backdrop-blur-sm">
              <h2 className="font-title-lg text-title-lg text-on-surface">Order confirmed</h2>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                Your order <strong className="font-semibold">#{id}</strong> is being prepared. We’ll notify you when it’s on its way.
              </p>
            </div>
            <div className="rounded-2xl border border-outline/20 bg-surface/60 p-4 shadow-sm sm:p-6 backdrop-blur-sm">
              <h3 className="font-title-md text-title-md text-on-surface">Tracking token</h3>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant break-all">{token}</p>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-error/20 bg-error/10 p-5 text-error sm:mt-10 sm:p-8">
            <h2 className="font-title-lg text-title-lg">Order not found</h2>
            <p className="mt-2 font-body-md text-body-md leading-relaxed">
              We couldn’t validate this order from your storage data. Please return to the catalog or place a new order.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
