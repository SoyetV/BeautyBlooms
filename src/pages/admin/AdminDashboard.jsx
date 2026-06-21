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
import ProductMarquee from '@/components/ui/ProductMarquee'

const TABS = [
  { id: 'products', label: 'Products', icon: '🌷' },
  { id: 'orders',   label: 'Orders',   icon: '📋' },
]

// ── Shared glass tokens ─────────────────────────────────
const glassPanel = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(249,168,212,0.25)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
}

const glassCard = {
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.5)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)',
}

const glassCardAlert = {
  background: 'rgba(250,236,193,0.55)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(232,170,51,0.35)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6)',
}

const glassToolbar = {
  background: 'rgba(255,255,255,0.5)',
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  border: '1px solid rgba(249,168,212,0.2)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
}

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
    <div className="relative min-h-screen page-enter">
      {/* ── Ambient background orbs ───────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)', filter: 'blur(90px)' }}
        />
        <div
          className="absolute top-1/3 -right-40 h-[380px] w-[380px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #e8aa33, transparent 70%)', filter: 'blur(100px)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #831843, transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      {/* ── Glass header ───────────────────────────────── */}
      <div className="relative z-10" style={glassPanel}>
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-charcoal-600 font-light">Manage your exquisite inventory and incoming orders.</p>
            </div>
          </div>

          {/* Stats strip */}
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-5">
            {[
              { label: 'Total products',  value: totalProducts, icon: '🌷' },
              { label: 'Out of stock',    value: outOfStock,   alert: outOfStock > 0, icon: '📦' },
              { label: 'Pending orders',  value: pendingOrders, alert: pendingOrders > 0, icon: '🧾' },
              { label: 'Total revenue',   value: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(totalRevenue), icon: '💰' },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="rounded-2xl px-4 py-3 opacity-0 animate-fade-in-up transition-all duration-300 hover:-translate-y-0.5 sm:px-5 sm:py-4 sm:rounded-3xl"
                style={{ ...(stat.alert ? glassCardAlert : glassCard), animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <dt className="text-[11px] uppercase tracking-wider text-charcoal-500 sm:text-xs">{stat.label}</dt>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.5)' }}
                    aria-hidden="true"
                  >
                    {stat.icon}
                  </span>
                </div>
                <dd className="mt-2 text-xl font-semibold tabular-nums text-charcoal-900 sm:text-2xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Tabs — glass pill segmented control */}
          <div
            className="mt-6 inline-flex gap-1 rounded-full p-1 sm:mt-8"
            style={{
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(249,168,212,0.25)',
            }}
            role="tablist"
            aria-label="Admin sections"
          >
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 sm:px-5 sm:text-sm"
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, #ec4899, #be185d)',
                          color: 'white',
                          boxShadow: '0 4px 14px rgba(236,72,153,0.35)',
                        }
                      : { color: '#6b616e' }
                  }
                >
                  <span aria-hidden="true">{tab.icon}</span>
                  {tab.label}
                  {tab.id === 'orders' && pendingOrders > 0 && (
                    <span
                      className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                      style={
                        isActive
                          ? { background: 'rgba(255,255,255,0.3)', color: 'white' }
                          : { background: 'linear-gradient(135deg, #ec4899, #be185d)', color: 'white' }
                      }
                    >
                      {pendingOrders > 9 ? '9+' : pendingOrders}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Tab content ────────────────────────────────── */}
      <main className="relative z-0 mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
        {activeTab === 'products' && (
          <section aria-label="Product inventory">
            {/* Product Marquee Management */}
            <ProductMarquee isAdmin={true} />

            <div
              className="mb-4 mt-6 flex flex-col gap-3 rounded-2xl px-4 py-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:px-5 sm:py-4"
              style={glassToolbar}
            >
              <p className="text-sm text-charcoal-600">{totalProducts} products total</p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
                <button onClick={openAdd} className="btn-primary px-3 py-2 text-xs sm:py-1.5">
                  Add product
                </button>
                <button
                  onClick={() => fetchProducts()}
                  className="btn-secondary px-3 py-2 text-xs sm:py-1.5"
                  aria-label="Refresh product list"
                >
                  Refresh
                </button>
              </div>
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
            <div
              className="mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:rounded-3xl sm:px-5 sm:py-4"
              style={glassToolbar}
            >
              <p className="text-sm text-charcoal-600">{orders.length} orders total</p>
              <button
                onClick={() => fetchOrders()}
                className="btn-secondary px-3 py-2 text-xs sm:py-1.5"
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