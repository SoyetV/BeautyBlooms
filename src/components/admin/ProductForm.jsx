// src/components/admin/ProductForm.jsx
// Modal form used for both creating and editing a product.
// Handles image file upload preview and all validation states.

import { useEffect, useRef, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'

const CATEGORIES = ['Roses', 'Sunflowers', 'Lilies', 'Orchids', 'Tulips', 'Mixed', 'Dried Flowers', 'Uncategorized']
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const EMPTY_FORM = {
  name:         '',
  description:  '',
  price:        '',
  stock_count:  '',
  category:     'Uncategorized',
  is_available: true,
}

export function ProductForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEdit = Boolean(initialData)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [errors,    setErrors]    = useState({})
  const fileRef = useRef(null)

  // Populate form when editing an existing product
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
    if (!form.name.trim())               errs.name        = 'Product name is required.'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
                                         errs.price       = 'Enter a valid price (e.g. 850).'
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
          // Keep existing image_url if no new file was chosen
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
      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">

        {/* Submit-level error */}
        {errors.submit && (
          <div role="alert" className="rounded-lg bg-error/10 px-4 py-3 font-body-sm text-body-sm text-error">
            {errors.submit}
          </div>
        )}

        {/* Image upload */}
        <div>
          <label className="label">Product photo</label>
          <div
            className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-outline/20 bg-surface/50 p-4 transition-colors hover:border-primary/50 hover:bg-surface-variant/30 sm:p-5"
            onClick={() => fileRef.current?.click()}
            onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            tabIndex={0}
            role="button"
            aria-label="Upload product image"
          >
            {preview ? (
              <img src={preview} alt="Product preview" className="h-36 w-full object-cover rounded-lg" />
            ) : (
              <>
                <svg className="h-8 w-8 text-on-surface-variant/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 3.75h6.75M16.875 3.75v6.75M6 20.25a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <p className="text-center font-body-sm text-body-sm text-on-surface-variant">Click to upload a photo <span className="text-on-surface-variant/70">(JPG, PNG, WebP - max 5 MB)</span></p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleImageChange} tabIndex={-1} />
          </div>
          {preview && (
            <button type="button" onClick={() => { setPreview(null); setImageFile(null) }}
              className="mt-1 font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors">
              Remove image
            </button>
          )}
          {errors.image && <p role="alert" className="mt-1 font-body-sm text-body-sm text-error">{errors.image}</p>}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="pf-name" className="label">Product name <span aria-hidden="true" className="text-error">*</span></label>
          <input
            id="pf-name" name="name" type="text"
            value={form.name} onChange={handleChange}
            placeholder="e.g. Red Velvet Roses"
            className={`input-field bg-surface text-on-surface border-outline/30 ${errors.name ? 'border-error/50 focus:ring-error/20' : ''}`}
            aria-required="true"
            aria-describedby={errors.name ? 'pf-name-error' : undefined}
          />
          {errors.name && <p id="pf-name-error" role="alert" className="mt-1 font-body-sm text-body-sm text-error">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="pf-desc" className="label">Description</label>
          <textarea
            id="pf-desc" name="description" rows={3}
            value={form.description} onChange={handleChange}
            placeholder="Describe this arrangement…"
            className="input-field resize-none"
          />
        </div>

        {/* Price + Stock row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pf-price" className="label">Price (₱) <span aria-hidden="true" className="text-error">*</span></label>
            <input
              id="pf-price" name="price" type="number" min="0" step="0.01"
              value={form.price} onChange={handleChange}
              placeholder="850.00"
              className={`input-field bg-surface text-on-surface border-outline/30 ${errors.price ? 'border-error/50 focus:ring-error/20' : ''}`}
              aria-required="true"
              aria-describedby={errors.price ? 'pf-price-error' : undefined}
            />
            {errors.price && <p id="pf-price-error" role="alert" className="mt-1 font-body-sm text-body-sm text-error">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="pf-stock" className="label">Stock count <span aria-hidden="true" className="text-error">*</span></label>
            <input
              id="pf-stock" name="stock_count" type="number" min="0" step="1"
              value={form.stock_count} onChange={handleChange}
              placeholder="20"
              className={`input-field bg-surface text-on-surface border-outline/30 ${errors.stock_count ? 'border-error/50 focus:ring-error/20' : ''}`}
              aria-required="true"
              aria-describedby={errors.stock_count ? 'pf-stock-error' : undefined}
            />
            {errors.stock_count && <p id="pf-stock-error" role="alert" className="mt-1 font-body-sm text-body-sm text-error">{errors.stock_count}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="pf-category" className="label">Category</label>
          <select id="pf-category" name="category" value={form.category} onChange={handleChange} className="input-field bg-surface text-on-surface border-outline/30">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Available toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={form.is_available}
            onClick={() => setForm(prev => ({ ...prev, is_available: !prev.is_available }))}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200
              ${form.is_available ? 'bg-primary' : 'bg-surface-variant/50'}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200
                ${form.is_available ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <span className="font-body-sm text-body-sm text-on-surface">
            {form.is_available ? 'Listed in catalog' : 'Hidden from catalog'}
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 border-t border-outline/20 pt-2 sm:flex sm:justify-end sm:gap-3">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary min-w-[110px]" disabled={saving}>
            {saving ? <><Spinner size="sm" /> Saving…</> : isEdit ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
