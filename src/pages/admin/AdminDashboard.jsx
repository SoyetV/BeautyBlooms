import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import { ProductTable } from '@/components/admin/ProductTable'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { ProductForm } from '@/components/admin/ProductForm'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('orders')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const { products, loading: pLoading, error: pError, createProduct, updateProduct, deleteProduct } = useProducts()
  const { orders, loading: oLoading, error: oError, updateOrderStatus } = useOrders()

  const handleEdit = (p) => {
    setEditingProduct(p)
    setShowProductForm(true)
  }

  const handleCloseForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  return (
    <div className="page-enter pt-24 pb-20 mx-auto max-w-6xl px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-2 block">Management</span>
           <h1 className="font-display text-4xl font-bold text-brand-on-surface">Atelier <span className="italic font-light">Dashboard</span></h1>
        </div>

        <div className="flex gap-2 p-1 glass rounded-full">
          <button
            onClick={() => setTab('orders')}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
              tab === 'orders' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-on-surface-variant hover:text-brand-on-surface'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setTab('inventory')}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
              tab === 'inventory' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-on-surface-variant hover:text-brand-on-surface'
            }`}
          >
            Inventory
          </button>
        </div>
      </div>

      <div className="card-glass p-8 min-h-[60vh]">
        {tab === 'orders' ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="font-display text-2xl font-bold text-brand-on-surface">Customer Requests</h2>
               <div className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/40">
                  {orders.length} TOTAL ORDERS
               </div>
            </div>
            <OrdersTable
              orders={orders}
              loading={oLoading}
              error={oError}
              onStatusChange={updateOrderStatus}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="font-display text-2xl font-bold text-brand-on-surface">Bloom Inventory</h2>
               <button onClick={() => setShowProductForm(true)} className="btn-primary py-2.5 text-xs px-6">
                  Add New Product
               </button>
            </div>
            <ProductTable
              products={products}
              loading={pLoading}
              error={pError}
              onEdit={handleEdit}
              onDelete={deleteProduct}
            />
          </div>
        )}
      </div>

      <ProductForm
        isOpen={showProductForm}
        onClose={handleCloseForm}
        product={editingProduct}
        onCreate={createProduct}
        onUpdate={updateProduct}
      />
    </div>
  )
}
