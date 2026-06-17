// src/App.jsx
// Root of the application: sets up React Router, context providers,
// the persistent Navbar/CartDrawer layout shell, and all page routes.

import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Spinner } from '@/components/ui/Spinner'

// ── Code-split page imports ──────────────────────────────
// Each page chunk is loaded on demand, reducing initial JS bundle size.
const HomePage         = lazy(() => import('@/pages/customer/HomePage'))
const CatalogPage      = lazy(() => import('@/pages/customer/CatalogPage'))
const CheckoutPage     = lazy(() => import('@/pages/customer/CheckoutPage'))
const OrderStatusPage  = lazy(() => import('@/pages/customer/OrderStatusPage'))
const AdminDashboard   = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminLogin       = lazy(() => import('@/pages/admin/AdminLogin'))

// ── Full-page loading fallback ───────────────────────────
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-live="polite" aria-busy="true">
      <Spinner size="lg" />
    </div>
  )
}

// ── Main layout shell (Navbar + page content + Footer) ──
function Layout() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Customer routes */}
            <Route path="/"          element={<HomePage />} />
            <Route path="/catalog"   element={<CatalogPage />} />
            <Route path="/checkout"  element={<CheckoutPage />} />
            <Route path="/orders/:orderId" element={<OrderStatusPage />} />

            {/* Admin routes */}
            <Route path="/admin"       element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Persistent cart drawer (rendered outside <main> to avoid layout shift) */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

// ── Root App: providers wrap everything ─────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
