import { useEffect, useState } from 'react'
import { Plus, X, Edit2, Check, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/utils/formatCurrency'

export default function ProductMarquee() {
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [newProduct, setNewProduct] = useState({ name: '', price: '', image_url: '', imageFile: null })
  const [editForm, setEditForm] = useState({ name: '', price: '', image_url: '', imageFile: null })

  const [newProductErrors, setNewProductErrors] = useState({})
  const [editErrors, setEditErrors] = useState({})

  useEffect(() => {
    fetchMarqueeProducts()
  }, [])

  async function fetchMarqueeProducts() {
    try {
      const { data, error } = await supabase
        .from('marquee_products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching marquee products:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(e, callback) {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      callback(null, null, 'Image size should be less than 2MB')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    callback(file, previewUrl, null)
  }

  async function uploadToSupabase(file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `marquee-${Math.random()}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    return publicUrl
  }

  async function handleAddProduct() {
    const errors = {}
    if (!newProduct.name) errors.name = 'Name is required'
    if (!newProduct.price || isNaN(newProduct.price)) errors.price = 'Valid price is required'
    if (!newProduct.imageFile) errors.image = 'Image is required'

    if (Object.keys(errors).length > 0) {
      setNewProductErrors(errors)
      return
    }

    setActionLoading(true)
    try {
      const publicUrl = await uploadToSupabase(newProduct.imageFile)
      const { error } = await supabase
        .from('marquee_products')
        .insert([{
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          image_url: publicUrl
        }])

      if (error) throw error

      setIsAdding(false)
      setNewProduct({ name: '', price: '', image_url: '', imageFile: null })
      fetchMarqueeProducts()
    } catch (err) {
      setNewProductErrors({ submit: err.message })
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Are you sure you want to remove this product from the marquee?')) return
    try {
      const { error } = await supabase.from('marquee_products').delete().eq('id', id)
      if (error) throw error
      fetchMarqueeProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
    }
  }

  function handleEditClick(product) {
    setEditingId(product.id)
    setEditForm({
      name: product.name || product.title,
      price: product.price.toString(),
      image_url: product.image_url || product.image,
      imageFile: null
    })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditErrors({})
  }

  async function handleSaveEdit() {
    if (!editForm.price || isNaN(editForm.price)) {
      setEditErrors({ price: 'Valid price is required' })
      return
    }

    setActionLoading(true)
    try {
      let finalImageUrl = editForm.image_url
      if (editForm.imageFile) {
        finalImageUrl = await uploadToSupabase(editForm.imageFile)
      }

      const { error } = await supabase
        .from('marquee_products')
        .update({
          name: editForm.name,
          price: parseFloat(editForm.price),
          image_url: finalImageUrl
        })
        .eq('id', editingId)

      if (error) throw error

      setEditingId(null)
      fetchMarqueeProducts()
    } catch (err) {
      setEditErrors({ submit: err.message })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return null

  // Double the products for infinite effect
  const displayProducts = [...products, ...products]

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full overflow-hidden relative">
        <div className="flex animate-marquee hover-pause py-4">
          {displayProducts.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="flex-shrink-0 w-64 mx-4 card-glass overflow-hidden group"
            >
              <div className="h-48 overflow-hidden relative">
                {product.image_url || product.image ? (
                  <img
                    src={product.image_url || product.image}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-on-surface-variant/40">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-5 bg-white/40 flex flex-col justify-between">
                <h3 className="font-display text-lg text-brand-on-surface font-bold truncate">{product.name || product.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-bold text-brand-primary">{formatCurrency(product.price)}</span>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/60">Seasonal</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="w-full max-w-4xl mt-16 px-6">
          <div className="card-glass p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-brand-on-surface">Manage Marquee</h2>
              {!isAdding && (
                <button onClick={() => setIsAdding(true)} className="btn-primary py-2.5 px-6 text-xs">
                  <Plus size={16} /> Add Bloom
                </button>
              )}
            </div>

            {isAdding && (
              <div className="mb-8 p-6 bg-white/20 rounded-2xl border border-brand-secondary/5 animate-fade-in-up">
                <h3 className="font-bold text-brand-on-surface mb-6 text-sm uppercase tracking-widest">New Marquee Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Radiant Sunflowers"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Price (₱)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Image</label>
                    <input
                      type="file"
                      className="input-field py-2 text-xs"
                      onChange={(e) => handleImageUpload(e, (file, url, error) => {
                        if (error) {
                          setNewProductErrors({ ...newProductErrors, image: error })
                          return
                        }
                        setNewProduct({ ...newProduct, image_url: url, imageFile: file })
                      })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setIsAdding(false)} className="btn-secondary py-2.5 px-6 text-xs">Cancel</button>
                  <button
                    onClick={handleAddProduct}
                    className="btn-primary py-2.5 px-6 text-xs"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Saving...' : 'Add to Marquee'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative p-4 rounded-2xl border border-brand-secondary/5 bg-white/10 hover:bg-white/30 transition-colors group">
                  {editingId === product.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="input-field py-2 text-xs"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <input
                        type="number"
                        className="input-field py-2 text-xs"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      />
                      <div className="flex gap-2 justify-end pt-2">
                        <button onClick={handleCancelEdit} className="p-1.5 text-brand-on-surface-variant hover:text-brand-on-surface"><X size={16} /></button>
                        <button onClick={handleSaveEdit} className="p-1.5 text-brand-primary hover:scale-110"><Check size={16} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-brand-secondary/5">
                          <img src={product.image_url || product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-brand-on-surface truncate">{product.name || product.title}</h4>
                          <p className="text-[10px] font-bold text-brand-primary uppercase mt-1">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-1.5 bg-white/80 rounded-full text-brand-on-surface-variant hover:text-brand-primary shadow-sm"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 bg-white/80 rounded-full text-brand-on-surface-variant hover:text-brand-error shadow-sm"
                        >
                          <X size={12} />
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
