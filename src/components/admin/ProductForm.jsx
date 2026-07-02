// src/components/admin/ProductForm.jsx
// Modern Flora — Modal form using Input primitive, accessible error states,
// image upload with preview, switch toggle for availability.

import { useEffect, useRef, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import Input from '@/components/ui/Input'

const CATEGORIES = ['Roses', 'Sunflowers', 'Lilies', 'Orchids', 'Tulips', 'Mixed', 'Dried Flowers', 'Uncategorized']
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const EMPTY_FORM = {
  name:         '',
  description:  '',
  price:        '',
  stock_count:  '',
  category:     'Uncategorized',
  is_available: true,
  is_featured:  false,
}

export function ProductForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEdit = Boolean(initialData)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [errors,    setErrors]    = useState({})
  const fileRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          name:         initialData.name         ?? '',
          description:  initialData.description  ?? '',
          price:        String(initialData.price ?? ''),
          stock_count:  String(initialData.stock_count ?? ''),
          category:     initialData.category     ?? 'Uncategorized',
          is_available: initialData.is_available ?? true,
          is_featured:  initialData.is_featured  ?? false,
        })
        setPreview(initialData.image_url ?? null)
      } else {
        setForm(EMPTY_FORM)
        setPreview(null)
      }
      setImageFile(null)
      setErrors({})
    }
  }, [isOpen, initialData])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Please select a JPG, PNG, or WebP image.' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be smaller than 5 MB.' }))
      return
    }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setErrors(prev => ({ ...prev, image: null }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())
      errs.name = 'Product name is required.'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      errs.price = 'Enter a valid price (e.g. 850).'
    if (!form.stock_count || isNaN(Number(form.stock_count)) || Number(form.stock_count) < 0)
      errs.stock_count = 'Enter a valid stock count (0 or more).'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      await onSubmit(
        {
          name:         form.name.trim(),
          description:  form.description.trim() || null,
          price:        parseFloat(form.price),
          stock_count:  parseInt(form.stock_count, 10),
          category:     form.category,
          is_available: form.is_available,
          is_featured:  form.is_featured,
          ...(isEdit && !imageFile ? { image_url: initialData?.image_url ?? null } : {}),
        },
        imageFile
      )
      onClose()
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit product' : 'Add new product'} size="md">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Submit-level error */}
        {errors.submit && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg bg-error-soft px-4 py-3 border border-error/20"
          >
            <span
              className="material-symbols-outlined icon-fill text-error-fg shrink-0 mt-0.5"
              style={{ fontSize: '18px' }}
              aria-hidden="true"
            >
              error
            </span>
            <p className="text-body-sm text-error-fg">{errors.submit}</p>
          </div>
        )}

        {/* Image upload */}
        <div>
          <span className="label">Product photo</span>
          <div
            className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-surface-2/50 p-5 transition-colors duration-250 ease-smooth hover:border-primary-300 hover:bg-primary-50/40"
            onClick={() => fileRef.current?.click()}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), fileRef.current?.click())}
            tabIndex={0}
            role="button"
            aria-label="Upload product image"
          >
            {preview ? (
              <img src={preview} alt="Product preview" className="h-32 w-full object-cover rounded-md" />
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-subtle"
                  style={{ fontSize: '32px' }}
                  aria-hidden="true"
                >
                  add_photo_alternate
                </span>
                <p className="text-center text-body-sm text-muted">
                  Click to upload a photo
                  <span className="block text-body-xs text-subtle mt-0.5">JPG, PNG, or WebP · max 5 MB</span>
                </p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleImageChange}
              tabIndex={-1}
            />
          </div>
          {preview && (
            <button
              type="button"
              onClick={() => { setPreview(null); setImageFile(null) }}
              className="mt-2 text-body-xs text-muted hover:text-error-fg transition-colors duration-250 ease-smooth"
            >
              Remove image
            </button>
          )}
          {errors.image && (
            <p role="alert" className="mt-1 text-body-xs text-error-fg">{errors.image}</p>
          )}
        </div>

        {/* Name */}
        <Input
          id="pf-name"
          name="name"
          label="Product name"
          type="text"
          required
          placeholder="e.g. Red Velvet Roses"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />

        {/* Description */}
        <Input
          id="pf-desc"
          name="description"
          label="Description"
          as="textarea"
          rows={3}
          placeholder="Describe this arrangement…"
          value={form.description}
          onChange={handleChange}
        />

        {/* Price + Stock row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="pf-price"
            name="price"
            label="Price (₱)"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="850.00"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
          />
          <Input
            id="pf-stock"
            name="stock_count"
            label="Stock count"
            type="number"
            min="0"
            step="1"
            required
            placeholder="20"
            value={form.stock_count}
            onChange={handleChange}
            error={errors.stock_count}
          />
        </div>

        {/* Category */}
        <Input
          id="pf-category"
          name="category"
          label="Category"
          as="select"
          value={form.category}
          onChange={handleChange}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Input>

        {/* Available toggle */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            role="switch"
            aria-checked={form.is_available}
            aria-label="Toggle product availability"
            onClick={() => setForm(prev => ({ ...prev, is_available: !prev.is_available }))}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                        transition-colors duration-250 ease-smooth
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                        ${form.is_available ? 'bg-primary-500' : 'bg-border-strong'}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm
                          transition-transform duration-250 ease-spring
                          ${form.is_available ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <span className="text-body-sm text-foreground">
            {form.is_available ? 'Listed in catalog' : 'Hidden from catalog'}
          </span>
        </div>

        {/* Featured toggle (marquee) */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            role="switch"
            aria-checked={form.is_featured}
            aria-label="Toggle featured in marquee"
            onClick={() => setForm(prev => ({ ...prev, is_featured: !prev.is_featured }))}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                        transition-colors duration-250 ease-smooth
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                        ${form.is_featured ? 'bg-accent-500' : 'bg-border-strong'}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm
                          transition-transform duration-250 ease-spring
                          ${form.is_featured ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <div className="flex flex-col">
            <span className="text-body-sm text-foreground">
              {form.is_featured ? 'Featured in marquee' : 'Not in marquee'}
            </span>
            <span className="text-body-xs text-subtle">
              Featured products appear in the scrolling marquee on the homepage and catalog.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 sm:flex sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary justify-center"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary min-w-[120px] justify-center"
            disabled={saving}
            aria-busy={saving || undefined}
          >
            {saving ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving…
              </>
            ) : isEdit ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
