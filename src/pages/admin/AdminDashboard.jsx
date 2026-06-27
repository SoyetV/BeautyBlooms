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
  { id: 'products', label: 'Products', icon: 'inventory_2' },
  { id: 'orders',   label: 'Orders',   icon: 'receipt_long' },
]

// ── Shared glass tokens ─────────────────────────────────
const glassPanel = "glass-panel"
const glassCard = "glass-panel"
const glassCardAlert = "glass-panel border-error/20"
const glassToolbar = "glass-panel"

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
      <div className="flex min-h-screen items-center justify-center pt-[88px]">
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
    <div className="relative min-h-screen page-enter bg-background pt-[88px]">
      {/* ── Ambient background orbs ───────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #b10e6b, transparent 70%)', filter: 'blur(90px)' }}
        />
        <div
          className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #805618, transparent 70%)', filter: 'blur(110px)' }}
        />
      </div>

      <main className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="flex flex-col gap-2">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">Admin Dashboard</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your botanical atelier operations.</p>
        </header>

        {/* ── Stats strip ───────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Products',  value: totalProducts,                                                                icon: 'inventory_2',    tone: 'primary' },
            { label: 'Out of Stock',    value: outOfStock,    alert: outOfStock > 0,                                          icon: 'error',          tone: 'error' },
            { label: 'Pending Orders',  value: pendingOrders, alert: pendingOrders > 0,                                      icon: 'receipt_long',   tone: 'primary' },
            { label: 'Revenue (PHP)',   value: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(totalRevenue), icon: 'payments', tone: 'primary' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className={`rounded-xl p-6 flex flex-col gap-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 opacity-0 animate-fade-in-up ${stat.alert ? glassCardAlert : glassCard}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className={`font-label-md text-label-md uppercase tracking-widest ${stat.tone === 'error' ? 'text-error' : 'text-secondary'}`}>
                  {stat.label}
                </span>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-bright"
                  aria-hidden="true"
                >
                  <span className={`material-symbols-outlined text-sm ${stat.tone === 'error' ? 'text-error' : 'text-primary'}`}>
                    {stat.icon}
                  </span>
                </span>
              </div>
              <span className={`font-body-md text-headline-md font-semibold tabular-nums ${stat.tone === 'error' ? 'text-error' : 'text-primary'}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </section>

        {/* ── Tab content (with stats tabs at top) ─────── */}
        <section className={`${glassPanel} rounded-2xl overflow-hidden flex flex-col`}>
          {/* Tab Headers */}
          <div className="flex border-b border-secondary/20 bg-surface-container-low/50">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-label-md text-label-md transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary bg-white/20'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  {tab.label === 'Products' ? 'Products Inventory' : 'Recent Orders'}
                  {tab.id === 'orders' && pendingOrders > 0 && (
                    <span
                      className={`ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-primary/30 text-primary'
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

          {/* Toolbar (refresh + add) */}
          <div className={`flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 ${glassToolbar} border-b border-secondary/10`}>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {activeTab === 'products' ? `${totalProducts} products total` : `${orders.length} orders total`}
            </p>
            <div className="flex items-center gap-3">
              {activeTab === 'products' && (
                <button onClick={openAdd} className="btn-primary px-3 py-2 text-xs sm:py-1.5">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add product
                </button>
              )}
              <button
                onClick={() => activeTab === 'products' ? fetchProducts() : fetchOrders()}
                className="btn-secondary px-3 py-2 text-xs sm:py-1.5"
                aria-label={`Refresh ${activeTab} list`}
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'products' && (
              <>
                {/* Product Marquee Management */}
                <ProductMarquee
                  isAdmin={true}
                  products={products}
                  onCreate={createProduct}
                  onUpdate={updateProduct}
                  onDelete={deleteProduct}
                />
                <div className="mt-8">
                  <ProductTable
                    products={products}
                    loading={productsLoading}
                    error={productsError}
                    onEdit={openEdit}
                    onDelete={deleteProduct}
                  />
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <OrdersTable
                orders={orders}
                loading={ordersLoading}
                error={ordersError}
                onStatusChange={updateOrderStatus}
              />
            )}
          </div>
        </section>
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