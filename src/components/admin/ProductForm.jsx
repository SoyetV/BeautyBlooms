import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'

const CATEGORIES = ['Mixed Bouquets', 'Luxury Roses', 'Dried Flowers', 'Seasonal', 'Orchids', 'Gift Sets']

export function ProductForm({ isOpen, onClose, product, onCreate, onUpdate }) {
  const isEdit = !!product
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_count: '',
    category: CATEGORIES[0],
    image_url: '',
    is_available: true,
  })

  useEffect(() => {
    if (product) setForm({ ...product })
    else setForm({ name: '', description: '', price: '', stock_count: '', category: CATEGORIES[0], image_url: '', is_available: true })
    setErrors({})
  }, [product, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) await onUpdate(product.id, form)
      else await onCreate(form)
      onClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Refine Product' : 'Curate New Bloom'} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="E.g. Eternal Blush Bouquet" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Botanical details..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Price (₱)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required className="input-field" placeholder="1500" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Stock</label>
            <input name="stock_count" type="number" value={form.stock_count} onChange={handleChange} required className="input-field" placeholder="12" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
           <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} className="h-4 w-4 rounded border-brand-secondary/20 text-brand-primary focus:ring-brand-primary" />
            <span className="text-xs font-medium text-brand-on-surface">Listed in catalog</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://..." />
        </div>

        <div className="pt-4 flex gap-4">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
            {saving ? <Spinner size="sm" /> : isEdit ? 'Update Bloom' : 'Add to Atelier'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
