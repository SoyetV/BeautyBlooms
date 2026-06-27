// src/pages/admin/AdminDashboard.jsx
// Redesigned admin dashboard with:
//   • Stat cards with week-over-week trend indicators
//   • Revenue Over Time bar chart (Weekly / Monthly toggle)
//   • Top Categories breakdown with progress bars
//   • 3 tabs: Products Inventory, Recent Orders, Marquee Settings
//   • Category filter dropdown on the Products tab
//
// The Marquee admin panel now lives under the "Marquee Settings" tab.

import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import { ProductTable } from '@/components/admin/ProductTable'
import { ProductForm } from '@/components/admin/ProductForm'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { Spinner } from '@/components/ui/Spinner'
import ProductMarquee from '@/components/ui/ProductMarquee'
import { formatCurrency } from '@/utils/formatCurrency'

const TABS = [
  { id: 'products', label: 'Products Inventory', icon: 'inventory_2' },
  { id: 'orders',   label: 'Recent Orders',      icon: 'receipt_long' },
  { id: 'marquee',  label: 'Marquee Settings',   icon: 'view_carousel' },
]

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
  const [activeTab,      setActiveTab]      = useState('products')
  const [chartView,      setChartView]      = useState('weekly')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formOpen,       setFormOpen]       = useState(false)
  const [editProduct,    setEditProduct]    = useState(null)

  const {
    products, loading: productsLoading, error: productsError,
    createProduct, updateProduct, deleteProduct, fetchProducts,
  } = useProducts({ adminMode: true })

  const {
    orders, loading: ordersLoading, error: ordersError,
    fetchOrders, updateOrderStatus,
  } = useOrders()

  // ── Computed stats with trends (must run before early returns) ──
  const stats = useMemo(() => {
    const totalProducts  = products.length
    const outOfStock     = products.filter(p => p.stock_count === 0).length
    const pendingOrders  = orders.filter(o => o.status === 'Pending').length
    const totalRevenue   = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total_amount), 0)

    const weekAgo = daysAgo(7)
    const twoWeeksAgo = daysAgo(14)
    const newThisWeek = products.filter(p => new Date(p.created_at) >= weekAgo).length
    const productsTrend = totalProducts > 0 ? Math.round((newThisWeek / Math.max(totalProducts - newThisWeek, 1)) * 100) : 0

    const revenueThisWeek = orders.filter(o => o.status !== 'Cancelled' && new Date(o.created_at) >= weekAgo).reduce((sum, o) => sum + Number(o.total_amount), 0)
    const revenueLastWeek = orders.filter(o => o.status !== 'Cancelled' && new Date(o.created_at) >= twoWeeksAgo && new Date(o.created_at) < weekAgo).reduce((sum, o) => sum + Number(o.total_amount), 0)
    const revenueTrend = revenueLastWeek > 0 ? Math.round(((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100) : 0

    return [
      { label: 'Total Products', value: totalProducts, trend: productsTrend, icon: 'inventory_2', tone: 'primary', alert: false },
      { label: 'Out of Stock', value: outOfStock, trend: 0, icon: 'error', tone: 'error', alert: outOfStock > 0 },
      { label: 'Pending Orders', value: pendingOrders, trend: 0, icon: 'receipt_long', tone: 'primary', alert: pendingOrders > 0 },
      { label: 'Revenue (PHP)', value: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(totalRevenue), trend: revenueTrend, icon: 'payments', tone: 'primary', alert: false },
    ]
  }, [products, orders])

  const chartData = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled')
    if (chartView === 'weekly') {
      return Array.from({ length: 7 }, (_, i) => {
        const dayStart = daysAgo(6 - i)
        const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1)
        const revenue = validOrders.filter(o => { const c = new Date(o.created_at); return c >= dayStart && c < dayEnd }).reduce((s, o) => s + Number(o.total_amount), 0)
        return { label: dayStart.toLocaleDateString('en', { weekday: 'narrow' }).toUpperCase(), fullLabel: dayStart.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }), revenue }
      })
    } else {
      return Array.from({ length: 8 }, (_, i) => {
        const weekEnd = daysAgo((7 - i) * 7)
        const weekStart = new Date(weekEnd); weekStart.setDate(weekStart.getDate() - 6)
        const revenue = validOrders.filter(o => { const c = new Date(o.created_at); return c >= weekStart && c < new Date(weekEnd.getTime() + 7 * 86400000) }).reduce((s, o) => s + Number(o.total_amount), 0)
        return { label: `W${i + 1}`, fullLabel: `${weekStart.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${new Date(weekEnd.getTime() + 6 * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' })}`, revenue }
      })
    }
  }, [orders, chartView])

  const topCategories = useMemo(() => {
    const counts = {}
    products.forEach(p => { const cat = p.category || 'Uncategorized'; counts[cat] = (counts[cat] || 0) + 1 })
    const total = products.length || 1
    return Object.entries(counts).map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) })).sort((a, b) => b.count - a.count).slice(0, 5)
  }, [products])

  const categories = useMemo(() => {
    const unique = [...new Set(products.map(p => p.category).filter(Boolean))]
    return ['all', ...unique.sort()]
  }, [products])

  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'all') return products
    return products.filter(p => p.category === categoryFilter)
  }, [products, categoryFilter])

  // ── Auth guard (must come AFTER all hooks) ───────────
  if (authLoading) {
    return (<div className="flex min-h-screen items-center justify-center pt-[88px]"><Spinner size="lg" /></div>)
  }
  if (!isAdmin) return <Navigate to="/" replace />

  // ── Product form handlers ────────────────────────────
  function openAdd() { setEditProduct(null); setFormOpen(true) }
  function openEdit(product) { setEditProduct(product); setFormOpen(true) }
  async function handleProductSubmit(fields, imageFile) {
    if (editProduct) { await updateProduct(editProduct.id, fields, imageFile) }
    else { await createProduct(fields, imageFile) }
  }

  const glassPanel = 'glass-panel'
  const glassCard  = 'glass-panel'
  const glassCardAlert = 'glass-panel border-error/20'

  return (
    <div className="relative min-h-screen page-enter bg-background pt-[88px]">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #b10e6b, transparent 70%)', filter: 'blur(90px)' }} />
        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #805618, transparent 70%)', filter: 'blur(110px)' }} />
      </div>

      <main className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-6 md:gap-8">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <h1 className="font-headline-md text-headline-md text-primary">Admin Dashboard</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your botanical atelier operations.</p>
        </header>

        {/* Stats strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div key={stat.label} className={`rounded-xl p-5 md:p-6 flex flex-col gap-2 opacity-0 animate-fade-in-up ${stat.alert ? glassCardAlert : glassCard}`} style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="flex items-center justify-between">
                <span className={`font-label-md text-label-md uppercase tracking-widest ${stat.tone === 'error' ? 'text-error' : 'text-on-surface-variant'}`}>{stat.label}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-bright" aria-hidden="true">
                  <span className={`material-symbols-outlined text-sm ${stat.tone === 'error' ? 'text-error' : 'text-primary'}`}>{stat.icon}</span>
                </span>
              </div>
              <span className={`text-2xl md:text-headline-sm font-bold tabular-nums ${stat.tone === 'error' ? 'text-error' : 'text-on-surface'}`}>{stat.value}</span>
              <div className="flex items-center gap-1 font-body-md text-body-md text-sm">
                {stat.trend > 0 ? (
                  <><span className="material-symbols-outlined text-sm text-green-600">trending_up</span><span className="text-green-600 font-semibold tabular-nums">+{stat.trend}%</span><span className="text-on-surface-variant">vs last week</span></>
                ) : stat.trend < 0 ? (
                  <><span className="material-symbols-outlined text-sm text-red-600">trending_down</span><span className="text-red-600 font-semibold tabular-nums">{stat.trend}%</span><span className="text-on-surface-variant">vs last week</span></>
                ) : (
                  <><span className="material-symbols-outlined text-sm text-on-surface-variant">trending_flat</span><span className="text-on-surface-variant font-semibold tabular-nums">0%</span><span className="text-on-surface-variant">no change</span></>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Revenue chart + Top categories */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className={`${glassPanel} rounded-2xl p-5 md:p-6 lg:col-span-2`}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Revenue Over Time</h2>
              <div className="flex rounded-full bg-surface-container-highest/60 p-1">
                {['weekly', 'monthly'].map(view => (
                  <button key={view} onClick={() => setChartView(view)} className={`px-4 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-300 ${chartView === view ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>{view === 'weekly' ? 'Weekly' : 'Monthly'}</button>
                ))}
              </div>
            </div>
            <RevenueChart data={chartData} view={chartView} />
          </div>

          <div className={`${glassPanel} rounded-2xl p-5 md:p-6`}>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Top Categories</h2>
            {topCategories.length === 0 ? (
              <div className="text-center py-8"><span className="material-symbols-outlined text-4xl text-on-surface-variant/40">bar_chart</span><p className="font-body-md text-body-md text-on-surface-variant mt-2">No data yet</p></div>
            ) : (
              <div className="space-y-4">
                {topCategories.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-body-md text-body-md font-medium text-on-surface">{cat.name}</span>
                      <span className="font-body-md text-body-md text-on-surface-variant font-semibold tabular-nums">{cat.percentage}%</span>
                    </div>
                    <div className="h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.percentage}%`, backgroundColor: '#b10e6b', opacity: 1 - i * 0.18 }} />
                    </div>
                    <p className="font-body-md text-body-md text-outline text-xs mt-1 tabular-nums">{cat.count} {cat.count === 1 ? 'product' : 'products'}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setActiveTab('products')} className="mt-6 w-full text-center font-label-md text-label-md uppercase tracking-wider text-primary hover:text-primary-container transition-colors border-t border-secondary/10 pt-4">View All Products →</button>
          </div>
        </section>

        {/* Tabbed section */}
        <section className={`${glassPanel} rounded-2xl overflow-hidden flex flex-col`}>
          <div className="flex border-b border-secondary/20 bg-surface-container-low/50 overflow-x-auto scrollbar-none">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              const pendingCount = orders.filter(o => o.status === 'Pending').length
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 md:px-8 py-4 font-label-md text-label-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-primary border-b-2 border-primary bg-white/20' : 'text-on-surface-variant hover:text-primary'}`}>
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  {tab.label}
                  {tab.id === 'orders' && pendingCount > 0 && (
                    <span className={`ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold tabular-nums ${isActive ? 'bg-primary/30 text-primary' : 'bg-primary text-on-primary'}`}>{pendingCount > 9 ? '9+' : pendingCount}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 border-b border-secondary/10 flex-wrap">
            <div className="flex items-center gap-3">
              {activeTab === 'products' && (
                <>
                  <div className="relative">
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input-field py-2 pr-8 pl-3 font-body-md text-body-md appearance-none cursor-pointer min-w-[160px]" aria-label="Filter by category">
                      {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant hidden sm:block tabular-nums">{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</p>
                </>
              )}
              {activeTab === 'orders' && <p className="font-body-md text-body-md text-on-surface-variant tabular-nums">{orders.length} {orders.length === 1 ? 'order' : 'orders'} total</p>}
              {activeTab === 'marquee' && <p className="font-body-md text-body-md text-on-surface-variant">Manage products in the scrolling marquee</p>}
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'products' && <button onClick={openAdd} className="btn-primary px-3 py-2 text-xs sm:py-1.5"><span className="material-symbols-outlined text-sm">add</span>Add product</button>}
              <button onClick={() => activeTab === 'products' ? fetchProducts() : activeTab === 'orders' ? fetchOrders() : fetchProducts()} className="btn-secondary px-3 py-2 text-xs sm:py-1.5" aria-label="Refresh list"><span className="material-symbols-outlined text-sm">refresh</span>Refresh</button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5 md:p-6">
            {activeTab === 'products' && <ProductTable products={filteredProducts} loading={productsLoading} error={productsError} onEdit={openEdit} onDelete={deleteProduct} />}
            {activeTab === 'orders' && <OrdersTable orders={orders} loading={ordersLoading} error={ordersError} onStatusChange={updateOrderStatus} />}
            {activeTab === 'marquee' && <ProductMarquee isAdmin={true} products={products} onCreate={createProduct} onUpdate={updateProduct} onDelete={deleteProduct} />}
          </div>
        </section>
      </main>

      <ProductForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditProduct(null) }} onSubmit={handleProductSubmit} initialData={editProduct} />
    </div>
  )
}

// ── Revenue bar chart ─────────────────────────────────────────────────────
function RevenueChart({ data, view }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)

  return (
    <div>
      <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-44 md:h-52">
        {data.map((d, i) => {
          const heightPct = (d.revenue / maxRevenue) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-surface text-xs rounded-lg px-2.5 py-1.5 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                <div className="font-semibold tabular-nums">{formatCurrency(d.revenue)}</div>
                <div className="text-[10px] text-surface/70">{d.fullLabel}</div>
              </div>
              <div className="w-full flex-1 flex items-end">
                <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${Math.max(heightPct, d.revenue > 0 ? 4 : 1)}%`, background: d.revenue > 0 ? `linear-gradient(180deg, #d23284 0%, #b10e6b 100%)` : 'rgba(183, 183, 183, 0.2)', opacity: d.revenue > 0 ? 0.5 + (i / data.length) * 0.5 : 0.3 }} />
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant text-[10px] sm:text-xs tabular-nums">{d.label}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary/10">
        <div>
          <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">{view === 'weekly' ? 'This Week' : 'Last 8 Weeks'}</p>
          <p className="text-lg font-bold text-primary tabular-nums">{formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}</p>
        </div>
        <div className="text-right">
          <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Avg / period</p>
          <p className="text-lg font-bold text-on-surface tabular-nums">{formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0) / Math.max(data.length, 1))}</p>
        </div>
      </div>
    </div>
  )
}