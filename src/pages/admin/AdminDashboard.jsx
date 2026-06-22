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
const glassPanel = "bg-surface/80 backdrop-blur-xl border border-primary/20 shadow-sm"
const glassCard = "bg-surface-container backdrop-blur-lg border border-outline/30 shadow-sm"
const glassCardAlert = "bg-secondary-container/50 backdrop-blur-lg border border-secondary/30 shadow-sm"
const glassToolbar = "bg-surface-container-low backdrop-blur-lg border border-outline/20 shadow-sm"

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
    <div className="relative min-h-screen page-enter bg-background">
      {/* ── Ambient background orbs ───────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)', filter: 'blur(90px)' }}
        />
      </div>

      {/* ── Glass header ───────────────────────────────── */}
      <div className={`relative z-10 ${glassPanel}`}>
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display-md text-display-md text-on-surface">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-on-surface-variant font-body-sm">Manage your exquisite inventory and incoming orders.</p>
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
                className={`rounded-2xl px-4 py-3 opacity-0 animate-fade-in-up transition-all duration-300 hover:-translate-y-0.5 sm:px-5 sm:py-4 sm:rounded-3xl ${stat.alert ? glassCardAlert : glassCard}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <dt className="text-[11px] uppercase tracking-wider text-on-surface-variant sm:text-xs">{stat.label}</dt>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm bg-surface-bright"
                    aria-hidden="true"
                  >
                    {stat.icon}
                  </span>
                </div>
                <dd className="mt-2 text-xl font-semibold tabular-nums text-on-surface sm:text-2xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Tabs — glass pill segmented control */}
          <div
            className="mt-6 inline-flex gap-1 rounded-full p-1 sm:mt-8 bg-surface/50 backdrop-blur-md border border-outline/20"
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
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 sm:px-5 sm:text-sm ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span aria-hidden="true">{tab.icon}</span>
                  {tab.label}
                  {tab.id === 'orders' && pendingOrders > 0 && (
                    <span
                      className={`ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-on-primary/30 text-on-primary'
                          : 'bg-primary text-on-primary'
                      }`}
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
              className={`mb-4 mt-6 flex flex-col gap-3 rounded-2xl px-4 py-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:px-5 sm:py-4 ${glassToolbar}`}
            >
              <p className="text-sm text-on-surface-variant">{totalProducts} products total</p>
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
              className={`mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:rounded-3xl sm:px-5 sm:py-4 ${glassToolbar}`}
            >
              <p className="text-sm text-on-surface-variant">{orders.length} orders total</p>
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