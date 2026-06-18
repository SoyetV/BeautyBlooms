import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency } from '@/utils/formatCurrency'

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const { orders, loading, error, fetchOrders } = useOrders()

  useEffect(() => {
    if (user) fetchOrders()
  }, [user, fetchOrders])

  // If auth still loading, show spinner
  if (authLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  // Not signed in → ask user to sign in to view order history
  if (!user) return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-4xl mb-4" aria-hidden="true">🔒</p>
      <h1 className="font-display text-xl font-semibold text-gray-900 mb-2">Sign in to view your orders</h1>
      <p className="text-sm text-gray-500 mb-6">Order history is available for signed-in customers. If you just placed an order as a guest, use the tracking link shown after checkout.</p>
      <Link to="/admin/login" className="btn-primary">Sign in</Link>
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
      ) : error ? (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">You have no orders yet.</p>
          <Link to="/catalog" className="btn-primary mt-4 inline-block">Start shopping</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map(o => (
            <li key={o.id} className="card px-4 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Order <span className="font-mono">{o.id}</span></p>
                <p className="text-sm text-gray-500">Placed {new Date(o.created_at).toLocaleString()}</p>
                <p className="text-sm text-gray-700 mt-1">{o.order_items?.length ?? 0} items · {formatCurrency(o.total_amount)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-sm text-gray-600`}>{o.status}</span>
                <Link to={`/orders/${o.id}`} className="btn-secondary text-sm">View status</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
