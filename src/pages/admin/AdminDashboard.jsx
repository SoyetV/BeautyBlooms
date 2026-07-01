// src/pages/admin/AdminDashboard.jsx
// Modern Flora — refreshed stat cards (Card default variant per ui-ux-pro-max),
// revenue chart card, top categories, Tabs primitive for tabbed tables.
// Drops ambient blur orbs (per Phase 4 plan), uses single-source tokens.

import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import { ProductTable } from '@/components/admin/ProductTable'
import { ProductForm } from '@/components/admin/ProductForm'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { Spinner } from '@/components/ui/Spinner'
import Tabs from '@/components/ui/Tabs'
import ProductMarquee from '@/components/ui/ProductMarquee'
import { formatCurrency } from '@/utils/formatCurrency'

// ── Helpers ──────────────────────────────────────────────────────────────
function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function daysAgo(n) {
  const d = startOfDay(new Date())
  d.setDate(d.getDate() - n)
  return d
}

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth()
  const [chartView,      setChartView]      = useState('weekly')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formOpen,       setFormOpen]       = useState(false)
  const [editProduct,    setEditProduct]    = useState(null)
  const [activeTab,      setActiveTab]      = useState('products')

  const {
    products, loading: productsLoading, error: productsError,
    createProduct, updateProduct, deleteProduct, fetchProducts,
  } = useProducts({ adminMode: true })

  const {
    orders, loading: ordersLoading, error: ordersError,
    fetchOrders, updateOrderStatus,
  } = useOrders()

  // ── Computed stats (must run before early returns) ──
  const stats = useMemo(() => {
    const totalProducts  = products.length
    const outOfStock     = products.filter(p => p.stock_count === 0).length
    const pendingOrders  = orders.filter(o => o.status === 'Pending').length
    const totalRevenue   = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount), 0)

    const weekAgo = daysAgo(7)
    const twoWeeksAgo = daysAgo(14)
    const newThisWeek = products.filter(p => new Date(p.created_at) >= weekAgo).length
    const productsTrend = totalProducts > 0
      ? Math.round((newThisWeek / Math.max(totalProducts - newThisWeek, 1)) * 100)
      : 0

    const revenueThisWeek = orders
      .filter(o => o.status !== 'Cancelled' && new Date(o.created_at) >= weekAgo)
      .reduce((sum, o) => sum + Number(o.total_amount), 0)
    const revenueLastWeek = orders
      .filter(o => o.status !== 'Cancelled' && new Date(o.created_at) >= twoWeeksAgo && new Date(o.created_at) < weekAgo)
      .reduce((sum, o) => sum + Number(o.total_amount), 0)
    const revenueTrend = revenueLastWeek > 0
      ? Math.round(((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100)
      : 0

    return [
      {
        label: 'Total Products',
        value: totalProducts.toLocaleString(),
        trend: productsTrend,
        icon: 'inventory_2',
        tone: 'neutral',
      },
      {
        label: 'Out of Stock',
        value: outOfStock.toLocaleString(),
        trend: 0,
        icon: 'error',
        tone: outOfStock > 0 ? 'warning' : 'neutral',
        alert: outOfStock > 0,
      },
      {
        label: 'Pending Orders',
        value: pendingOrders.toLocaleString(),
        trend: 0,
        icon: 'receipt_long',
        tone: pendingOrders > 0 ? 'warning' : 'neutral',
        alert: pendingOrders > 0,
      },
      {
        label: 'Revenue',
        value: new Intl.NumberFormat('en-PH', {
          style: 'currency',
          currency: 'PHP',
          maximumFractionDigits: 0,
        }).format(totalRevenue),
        trend: revenueTrend,
        icon: 'payments',
        tone: 'neutral',
      },
    ]
  }, [products, orders])

  const chartData = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled')
    if (chartView === 'weekly') {
      return Array.from({ length: 7 }, (_, i) => {
        const dayStart = daysAgo(6 - i)
        const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1)
        const revenue = validOrders
          .filter(o => { const c = new Date(o.created_at); return c >= dayStart && c < dayEnd })
          .reduce((s, o) => s + Number(o.total_amount), 0)
        return {
          label: dayStart.toLocaleDateString('en', { weekday: 'narrow' }).toUpperCase(),
          fullLabel: dayStart.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
          revenue,
        }
      })
    } else {
      return Array.from({ length: 8 }, (_, i) => {
        const weekEnd = daysAgo((7 - i) * 7)
        const weekStart = new Date(weekEnd); weekStart.setDate(weekStart.getDate() - 6)
        const revenue = validOrders
          .filter(o => { const c = new Date(o.created_at); return c >= weekStart && c < new Date(weekEnd.getTime() + 7 * 86400000) })
          .reduce((s, o) => s + Number(o.total_amount), 0)
        return {
          label: `W${i + 1}`,
          fullLabel: `${weekStart.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${new Date(weekEnd.getTime() + 6 * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' })}`,
          revenue,
        }
      })
    }
  }, [orders, chartView])

  const topCategories = useMemo(() => {
    const counts = {}
    products.forEach(p => { const cat = p.category || 'Uncategorized'; counts[cat] = (counts[cat] || 0) + 1 })
    const total = products.length || 1
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [products])

  const categories = useMemo(() => {
    const unique = [...new Set(products.map(p => p.category).filter(Boolean))]
    return ['all', ...unique.sort()]
  }, [products])

  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'all') return products
    return products.filter(p => p.category === categoryFilter)
  }, [products, categoryFilter])

  const pendingCount = useMemo(
    () => orders.filter(o => o.status === 'Pending').length,
    [orders]
  )

  const tabs = [
    { id: 'products', label: 'Products',       icon: 'inventory_2' },
    { id: 'orders',   label: 'Recent Orders',  icon: 'receipt_long', badge: pendingCount },
    { id: 'marquee',  label: 'Marquee',        icon: 'view_carousel' },
  ]

  // ── Auth guard (must come AFTER all hooks) ───────────
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <Spinner size="lg" />
      </div>
    )
  }
  if (!isAdmin) return <Navigate to="/" replace />

  // ── Product form handlers ────────────────────────────
  function openAdd() { setEditProduct(null); setFormOpen(true) }
  function openEdit(product) { setEditProduct(product); setFormOpen(true) }
  async function handleProductSubmit(fields, imageFile) {
    if (editProduct) { await updateProduct(editProduct.id, fields, imageFile) }
    else { await createProduct(fields, imageFile) }
  }

  return (
    <div className="page-enter bg-background pt-24 md:pt-32 pb-section-y">
      <main className="mx-auto max-w-container px-margin-mobile md:px-margin-desktop flex flex-col gap-8 md:gap-10">

        {/* Header */}
        <header>
          <p className="eyebrow-strip mb-2"><span>Operations</span></p>
          <h1 className="font-display text-display-lg md:text-display-xl text-foreground tracking-tight leading-[1.1]">
            Admin dashboard
          </h1>
          <p className="text-body-md text-muted mt-2 max-w-xl">
            Manage your botanical atelier operations. {pendingCount > 0 && (
              <span className="text-accent-700 font-medium">
                {pendingCount} {pendingCount === 1 ? 'order' : 'orders'} awaiting attention.
              </span>
            )}
          </p>
        </header>

        {/* Stats strip — Card default variant (sm shadow + 1px border) */}
        <section
          aria-label="Key metrics"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} stat={stat} delay={idx * 60} />
          ))}
        </section>

        {/* Revenue chart + Top categories */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue chart */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="font-display text-display-sm font-semibold text-foreground">
                  Revenue over time
                </h2>
                <p className="text-body-xs text-muted mt-0.5">
                  Excludes cancelled orders
                </p>
              </div>
              {/* Segmented control */}
              <div
                role="group"
                aria-label="Chart view"
                className="inline-flex rounded-full bg-surface-2 p-1 border border-border"
              >
                {['weekly', 'monthly'].map(view => (
                  <button
                    key={view}
                    onClick={() => setChartView(view)}
                    aria-pressed={chartView === view}
                    className={`px-3.5 py-1.5 rounded-full text-body-xs font-semibold uppercase tracking-eyebrow
                                transition-all duration-250 ease-spring
                                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                                ${chartView === view
                                  ? 'bg-surface text-primary-700 shadow-sm'
                                  : 'text-muted hover:text-foreground'
                                }`}
                  >
                    {view === 'weekly' ? 'Weekly' : 'Monthly'}
                  </button>
                ))}
              </div>
            </div>
            <RevenueChart data={chartData} view={chartView} />
          </div>

          {/* Top categories */}
          <div className="card p-6">
            <h2 className="font-display text-display-sm font-semibold text-foreground mb-5">
              Top categories
            </h2>
            {topCategories.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center gap-2">
                <span
                  className="material-symbols-outlined text-subtle"
                  style={{ fontSize: '32px' }}
                  aria-hidden="true"
                >
                  bar_chart
                </span>
                <p className="text-body-sm text-muted">No data yet</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {topCategories.map((cat, i) => (
                  <li key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-body-sm font-medium text-foreground">{cat.name}</span>
                      <span className="text-body-sm text-muted font-semibold tabular-nums">{cat.percentage}%</span>
                    </div>
                    <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-spring"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: 'var(--color-bloom-500)',
                          opacity: 1 - i * 0.18,
                        }}
                      />
                    </div>
                    <p className="text-body-xs text-subtle mt-1 tabular-nums">
                      {cat.count} {cat.count === 1 ? 'product' : 'products'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setActiveTab('products')}
              className="mt-6 w-full text-center text-body-xs font-semibold uppercase tracking-eyebrow
                         text-primary-700 hover:text-primary-800 transition-colors duration-250 ease-smooth
                         border-t border-border pt-4"
            >
              View all products →
            </button>
          </div>
        </section>

        {/* Tabbed section */}
        <section className="card overflow-hidden">
          <Tabs
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
          >
            {() => (
              <div>
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border flex-wrap bg-surface-2/40">
                  <div className="flex items-center gap-3">
                    {activeTab === 'products' && (
                      <>
                        <div className="relative">
                          <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="input-field py-2 pr-9 pl-3 text-body-sm appearance-none cursor-pointer min-w-[160px]"
                            aria-label="Filter by category"
                          >
                            {categories.map(c => (
                              <option key={c} value={c}>
                                {c === 'all' ? 'All categories' : c}
                              </option>
                            ))}
                          </select>
                          <span
                            className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-subtle pointer-events-none"
                            style={{ fontSize: '18px' }}
                            aria-hidden="true"
                          >
                            expand_more
                          </span>
                        </div>
                        <p className="text-body-sm text-muted hidden sm:block tabular-nums">
                          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                        </p>
                      </>
                    )}
                    {activeTab === 'orders' && (
                      <p className="text-body-sm text-muted tabular-nums">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
                      </p>
                    )}
                    {activeTab === 'marquee' && (
                      <p className="text-body-sm text-muted">
                        Manage products in the scrolling marquee
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {activeTab === 'products' && (
                      <button
                        onClick={openAdd}
                        className="btn-primary px-3 py-2 text-body-xs"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">add</span>
                        Add product
                      </button>
                    )}
                    <button
                      onClick={() => activeTab === 'orders' ? fetchOrders() : fetchProducts()}
                      className="btn-secondary px-3 py-2 text-body-xs"
                      aria-label="Refresh list"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">refresh</span>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Tab content */}
                <div className="p-5 md:p-6">
                  {activeTab === 'products' && (
                    <ProductTable
                      products={filteredProducts}
                      loading={productsLoading}
                      error={productsError}
                      onEdit={openEdit}
                      onDelete={deleteProduct}
                    />
                  )}
                  {activeTab === 'orders' && (
                    <OrdersTable
                      orders={orders}
                      loading={ordersLoading}
                      error={ordersError}
                      onStatusChange={updateOrderStatus}
                    />
                  )}
                  {activeTab === 'marquee' && (
                    <ProductMarquee
                      isAdmin={true}
                      products={products}
                      onCreate={createProduct}
                      onUpdate={updateProduct}
                      onDelete={deleteProduct}
                    />
                  )}
                </div>
              </div>
            )}
          </Tabs>
        </section>
      </main>

      <ProductForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditProduct(null) }}
        onSubmit={handleProductSubmit}
        initialData={editProduct}
      />
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────
// Card default variant per ui-ux-pro-max: sm shadow + 1px border, 3-slot anatomy.
function StatCard({ stat, delay }) {
  const toneClasses = {
    neutral:  { icon: 'bg-primary-50 text-primary-700',         value: 'text-foreground' },
    warning:  { icon: 'bg-warning-soft text-warning-fg',        value: 'text-warning-fg' },
    error:    { icon: 'bg-error-soft text-error-fg',            value: 'text-error-fg' },
    success:  { icon: 'bg-success-soft text-success-fg',        value: 'text-foreground' },
  }[stat.tone] || {}

  return (
    <div
      className="card p-5 flex flex-col gap-3 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      aria-busy={false}
    >
      {/* Header slot — label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-eyebrow uppercase tracking-eyebrow text-muted">
          {stat.label}
        </span>
        <span
          className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${toneClasses.icon}`}
          aria-hidden="true"
        >
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: '18px' }}>
            {stat.icon}
          </span>
        </span>
      </div>

      {/* Content slot — value + trend */}
      <div className="flex flex-col gap-1">
        <span className={`font-display text-display-md font-semibold tabular-nums leading-tight ${toneClasses.value}`}>
          {stat.value}
        </span>
        {stat.trend !== 0 ? (
          <div className="flex items-center gap-1.5 text-body-xs">
            <span
              className={`material-symbols-outlined ${stat.trend > 0 ? 'text-success-fg' : 'text-error-fg'}`}
              style={{ fontSize: '14px' }}
              aria-hidden="true"
            >
              {stat.trend > 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span
              className={`font-semibold tabular-nums ${stat.trend > 0 ? 'text-success-fg' : 'text-error-fg'}`}
            >
              {stat.trend > 0 ? '+' : ''}{stat.trend}%
            </span>
            <span className="text-subtle">vs last week</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-body-xs">
            <span
              className="material-symbols-outlined text-subtle"
              style={{ fontSize: '14px' }}
              aria-hidden="true"
            >
              trending_flat
            </span>
            <span className="text-subtle">No change</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Revenue bar chart ─────────────────────────────────────────────────────
// CSS bars (existing pattern). Note: ui-ux-pro-max prefers Chart.js, but
// adding a dependency is out of Phase 4 scope; the existing CSS chart is
// retained and restyled with new tokens.
function RevenueChart({ data, view }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)
  const total = data.reduce((sum, d) => sum + d.revenue, 0)
  const avg = total / Math.max(data.length, 1)

  return (
    <div>
      <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-44 md:h-52">
        {data.map((d, i) => {
          const heightPct = (d.revenue / maxRevenue) * 100
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1.5 group relative"
            >
              {/* Tooltip */}
              <div
                className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           bg-foreground text-background text-body-xs rounded-md px-2.5 py-1.5
                           pointer-events-none whitespace-nowrap z-10 shadow-lg"
                role="tooltip"
              >
                <div className="font-semibold tabular-nums">{formatCurrency(d.revenue)}</div>
                <div className="text-body-xs text-background/70">{d.fullLabel}</div>
              </div>

              {/* Bar */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-md transition-all duration-500 ease-spring"
                  style={{
                    height: `${Math.max(heightPct, d.revenue > 0 ? 4 : 1)}%`,
                    background: d.revenue > 0
                      ? 'var(--color-bloom-500)'
                      : 'var(--color-surface-2)',
                    opacity: d.revenue > 0 ? 0.5 + (i / data.length) * 0.5 : 0.5,
                  }}
                />
              </div>

              {/* Label */}
              <span className="text-body-xs text-subtle tabular-nums">{d.label}</span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-eyebrow uppercase tracking-eyebrow text-muted">
            {view === 'weekly' ? 'This week' : 'Last 8 weeks'}
          </p>
          <p className="price text-price-md text-primary-700 mt-0.5">
            {formatCurrency(total)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-eyebrow uppercase tracking-eyebrow text-muted">
            Avg / period
          </p>
          <p className="font-mono tabular-nums text-foreground font-semibold mt-0.5">
            {formatCurrency(avg)}
          </p>
        </div>
      </div>
    </div>
  )
}
