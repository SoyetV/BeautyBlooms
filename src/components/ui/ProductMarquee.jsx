import React, { useMemo, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'

const Plus = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)
const Edit2 = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
)
const Check = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
)
const X = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
)
const ImageIcon = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
)

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export default function ProductMarquee({ isAdmin = false }) {
  const {
    products = [],
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts({ adminMode: isAdmin })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editErrors, setEditErrors] = useState({})
  const [isAdding, setIsAdding] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image_url: '', imageFile: null })
  const [newProductErrors, setNewProductErrors] = useState({})
  const [actionLoading, setActionLoading] = useState(false)

  const marqueeItems = useMemo(() => [...products, ...products], [products])

  const handleImageUpload = (e, callback) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      callback(null, '', 'Please select a JPG, PNG, or WebP image.')
      e.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_BYTES) {
      callback(null, '', 'Image must be smaller than 5 MB.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      callback(file, reader.result, null)
    }
    reader.readAsDataURL(file)
  }

  const validateProduct = ({ name, price }) => {
    const errors = {}
    if (!name?.trim()) errors.name = 'Product name is required.'
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errors.price = 'Enter a valid price greater than 0.'
    return errors
  }

  const handleEditClick = (product) => {
    setEditingId(product.id)
    setEditErrors({})
    setEditForm({
      name: product.name ?? product.title ?? '',
      price: String(product.price ?? ''),
      image_url: product.image_url ?? product.image ?? '',
      imageFile: null,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    const errors = validateProduct(editForm)
    if (Object.keys(errors).length) {
      setEditErrors(errors)
      return
    }

    setActionLoading(true)
    try {
      const fields = {
        name: editForm.name,
        price: Number(editForm.price),
        image_url: editForm.image_url || null,
      }
      await updateProduct(editingId, fields, editForm.imageFile)
      setEditingId(null)
    } catch (err) {
      console.error('[ProductMarquee] updateProduct failed:', err.message || err)
      setEditErrors({ submit: err.message || 'Unable to save product.' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from the marquee?')) return
    try {
      await deleteProduct(id)
    } catch (err) {
      console.error('[ProductMarquee] deleteProduct failed:', err.message || err)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleAddProduct = async () => {
    const errors = validateProduct(newProduct)
    if (Object.keys(errors).length) {
      setNewProductErrors(errors)
      return
    }

    setActionLoading(true)
    try {
      await createProduct(
        {
          name: newProduct.name.trim(),
          price: Number(newProduct.price),
          image_url: newProduct.image_url || null,
          category: 'Uncategorized',
          stock_count: 0,
          is_available: true,
          description: null,
        },
        newProduct.imageFile,
      )
      setNewProduct({ name: '', price: '', image_url: '', imageFile: null })
      setNewProductErrors({})
      setIsAdding(false)
    } catch (err) {
      console.error('[ProductMarquee] createProduct failed:', err.message || err)
      setNewProductErrors({ submit: err.message || 'Unable to add new product.' })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center py-12 bg-background overflow-hidden">
      <div className="w-full relative py-8 overflow-hidden bg-surface-container-low border-y border-outline/20 shadow-sm backdrop-blur-sm">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-marquee hover-pause group gap-6 px-6">
          {marqueeItems.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="card flex-shrink-0 w-72 md:w-80 overflow-hidden cursor-pointer group-hover:[animation-play-state:paused]"
            >
              <div className="relative h-80 overflow-hidden bg-surface-container">
                {product.image_url || product.image ? (
                  <img
                    src={product.image_url || product.image}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="p-5 bg-surface flex flex-col justify-between h-32">
                <h3 className="font-title-lg text-title-lg text-on-surface truncate">{product.name || product.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-label-lg text-label-lg text-primary">${product.price.toFixed(2)}</span>
                  <button className="px-4 py-2 border ring-1 ring-outline text-on-surface rounded-full font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-variant transition-all duration-300">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="w-full max-w-4xl mt-16 px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gold-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display text-charcoal-900">Admin: Manage Marquee</h2>
              {!isAdding && (
                <button onClick={() => setIsAdding(true)} className="btn-primary">
                  <Plus size={18} /> Add New Product
                </button>
              )}
            </div>

            {isAdding && (
              <div className="mb-8 p-6 bg-petal-50/50 rounded-xl border border-petal-100 animate-fade-in-up">
                <h3 className="font-medium text-charcoal-800 mb-4 text-lg">Add New Marquee Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="label">Product name</label>
                    <input
                      type="text"
                      className={`input-field ${newProductErrors.name ? 'border-red-400 focus:ring-red-200' : ''}`}
                      value={newProduct.name}
                      onChange={(e) => {
                        setNewProduct({ ...newProduct, name: e.target.value })
                        if (newProductErrors.name) setNewProductErrors({ ...newProductErrors, name: null })
                      }}
                      placeholder="E.g., Radiant Sunflowers"
                    />
                    {newProductErrors.name && <p className="mt-1 text-xs text-red-600">{newProductErrors.name}</p>}
                  </div>
                  <div>
                    <label className="label">Price ($)</label>
                    <input
                      type="number"
                      className={`input-field ${newProductErrors.price ? 'border-red-400 focus:ring-red-200' : ''}`}
                      value={newProduct.price}
                      onChange={(e) => {
                        setNewProduct({ ...newProduct, price: e.target.value })
                        if (newProductErrors.price) setNewProductErrors({ ...newProductErrors, price: null })
                      }}
                      placeholder="0.00"
                    />
                    {newProductErrors.price && <p className="mt-1 text-xs text-red-600">{newProductErrors.price}</p>}
                  </div>
                  <div>
                    <label className="label">Upload Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="input-field py-1.5 text-sm"
                      onChange={(e) => handleImageUpload(e, (file, url, error) => {
                        if (error) {
                          setNewProductErrors({ ...newProductErrors, image: error })
                          return
                        }
                        setNewProductErrors({ ...newProductErrors, image: null })
                        setNewProduct({ ...newProduct, image_url: url, imageFile: file })
                      })}
                    />
                    {newProductErrors.image && <p className="mt-1 text-xs text-red-600">{newProductErrors.image}</p>}
                  </div>
                </div>
                {newProductErrors.submit && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
                    {newProductErrors.submit}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setIsAdding(false); setNewProductErrors({}) }} className="btn-secondary">Cancel</button>
                  <button
                    onClick={handleAddProduct}
                    className="btn-primary"
                    disabled={actionLoading}
                    type="button"
                  >
                    {actionLoading ? 'Saving…' : 'Save Product'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors group">
                  {editingId === product.id ? (
                    <div className="space-y-3 animate-fade-in-up">
                      <input
                        type="text"
                        className="input-field py-1.5 text-sm"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <input
                        type="number"
                        className={`input-field py-1.5 text-sm ${editErrors.price ? 'border-red-400 focus:ring-red-200' : ''}`}
                        value={editForm.price}
                        onChange={(e) => {
                          setEditForm({ ...editForm, price: e.target.value })
                          if (editErrors.price) setEditErrors({ ...editErrors, price: null })
                        }}
                      />
                      {editErrors.price && <p className="mt-1 text-xs text-red-600">{editErrors.price}</p>}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="input-field py-1.5 text-sm"
                        onChange={(e) => handleImageUpload(e, (file, url, error) => {
                          if (error) {
                            setEditErrors({ ...editErrors, image: error })
                            return
                          }
                          setEditErrors({ ...editErrors, image: null })
                          setEditForm({ ...editForm, image_url: url, imageFile: file })
                        })}
                      />
                      {editErrors.image && <p className="mt-1 text-xs text-red-600">{editErrors.image}</p>}
                      {editErrors.submit && (
                        <p className="text-sm text-red-600">{editErrors.submit}</p>
                      )}
                      <div className="flex gap-2 justify-end pt-2">
                        <button onClick={handleCancelEdit} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"><X size={16} /></button>
                        <button onClick={handleSaveEdit} className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-md transition-colors"><Check size={16} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img src={product.image_url || product.image} alt={product.name || product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{product.name || product.title}</h4>
                          <p className="text-sm text-bloom-600">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 bg-white rounded-full shadow-sm text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-bloom-500"
                          type="button"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
