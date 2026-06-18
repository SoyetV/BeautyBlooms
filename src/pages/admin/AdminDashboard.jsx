// src/pages/admin/AdminDashboard.jsx
// Unified admin interface: tabbed between Products inventory and Orders dashboard.
// Orchestrates the ProductTable + OrdersTable components with their respective hooks.

import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import { ProductTable } from '@/components/admin/ProductTable'
import { ProductForm } from '@/components/admin/ProductForm'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { Spinner } from '@/components/ui/Spinner'

const TABS = [
  { id: 'products', label: 'Products', icon: '🌸' },
  { id: 'orders',   label: 'Orders',   icon: '📋' },
]

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth()
  const [activeTab,    setActiveTab]    = useState('products')
  const [formOpen,     setFormOpen]     = useState(false)
  const [editProduct,  setEditProduct]  = useState(null)   // null = "add new"

  // ── Products hook ────────────────────────────────────
  const {
    products,
    loading:  productsLoading,
    error:    productsError,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  } = useProducts({ adminMode: true })

  // ── Orders hook ──────────────────────────────────────
  const {
    orders,
    loading:  ordersLoading,
    error:    ordersError,
    fetchOrders,
    updateOrderStatus,
  } = useOrders()

  // ── Auth guard ───────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/" replace />

  // ── Product form handlers ────────────────────────────
  function openAdd() {
    setEditProduct(null)
    setFormOpen(true)
  }

  function openEdit(product) {
    setEditProduct(product)
    setFormOpen(true)
  }

  async function handleProductSubmit(fields, imageFile) {
    if (editProduct) {
      await updateProduct(editProduct.id, fields, imageFile)
    } else {
      await createProduct(fields, imageFile)
    }
  }

  // ── Stats bar ────────────────────────────────────────
  const totalProducts  = products.length
  const outOfStock     = products.filter(p => p.stock_count === 0).length
  const pendingOrders  = orders.filter(o => o.status === 'Pending').length
  const totalRevenue   = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0)

  return (
    <div className="min-h-screen bg-petal-50 page-enter">
      {/* Page header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gold-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-3xl font-bold text-charcoal-900 tracking-tight">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-charcoal-600 font-light">Manage your exquisite inventory and incoming orders.</p>
            </div>
            {activeTab === 'products' && (
              <button onClick={openAdd} className="btn-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add product
              </button>
            )}
          </div>

          {/* Stats strip */}
          <dl className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              { label: 'Total products',  value: totalProducts },
              { label: 'Out of stock',    value: outOfStock,   alert: outOfStock > 0 },
              { label: 'Pending orders',  value: pendingOrders, alert: pendingOrders > 0 },
              { label: 'Total revenue',   value: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(totalRevenue) },
            ].map((stat, idx) => (
              <div key={stat.label} className={`card px-5 py-4 opacity-0 animate-fade-in-up ${stat.alert ? 'ring-gold-300 bg-gold-50' : ''}`} style={{ animationDelay: `${idx * 100}ms` }}>
                <dt className="text-xs uppercase tracking-wider text-charcoal-500">{stat.label}</dt>
                <dd className={`mt-2 text-2xl font-semibold tabular-nums ${stat.alert ? 'text-charcoal-900' : 'text-charcoal-900'}`}>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Tabs */}
          <nav className="mt-8 flex gap-6 border-b border-gold-200/40 -mb-px" aria-label="Admin sections">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex items-center gap-2 px-2 py-3 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2
                  ${activeTab === tab.id
                    ? 'border-bloom-600 text-bloom-600'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-900 hover:border-gold-300'
                  }`}
              >
                <span aria-hidden="true">{tab.icon}</span>
                {tab.label}
                {tab.id === 'orders' && pendingOrders > 0 && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-bloom-500 text-[10px] font-bold text-white">
                    {pendingOrders > 9 ? '9+' : pendingOrders}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {activeTab === 'products' && (
          <section aria-label="Product inventory">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{totalProducts} products total</p>
              <button
                onClick={() => fetchProducts()}
                className="btn-secondary py-1.5 text-xs px-3"
                aria-label="Refresh product list"
              >
                Refresh
              </button>
            </div>
            <ProductTable
              products={products}
              loading={productsLoading}
              error={productsError}
              onEdit={openEdit}
              onDelete={deleteProduct}
            />
          </section>
        )}

        {activeTab === 'orders' && (
          <section aria-label="Orders dashboard">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{orders.length} orders total</p>
              <button
                onClick={() => fetchOrders()}
                className="btn-secondary py-1.5 text-xs px-3"
                aria-label="Refresh orders list"
              >
                Refresh
              </button>
            </div>
            <OrdersTable
              orders={orders}
              loading={ordersLoading}
              error={ordersError}
              onStatusChange={updateOrderStatus}
            />
          </section>
        )}
      </main>

      {/* Product add / edit modal */}
      <ProductForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditProduct(null) }}
        onSubmit={handleProductSubmit}
        initialData={editProduct}
      />
    </div>
  )
}
