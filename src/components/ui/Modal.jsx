// src/components/ui/Modal.jsx

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const maxW = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 py-4 sm:items-center sm:px-4 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{ background: 'rgba(45,27,46,0.5)', backdropFilter: 'blur(8px)' }}
    >
      {/* Panel */}
      <div
        className={`relative z-10 w-full ${maxW[size]} max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl animate-fade-in-up sm:max-h-[calc(100vh-4rem)] sm:rounded-3xl`}
        style={{
          background: 'rgba(253,242,248,0.88)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          border: '1px solid rgba(249,168,212,0.35)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2), 0 8px 24px rgba(236,72,153,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
          style={{
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(249,168,212,0.2)',
          }}
        >
          <h2 id="modal-title" className="font-display text-lg font-bold text-charcoal-900 sm:text-xl">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-charcoal-400 transition-all hover:text-charcoal-700"
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(249,168,212,0.25)',
            }}
            aria-label="Close modal"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto px-4 py-4 sm:max-h-[calc(100vh-9rem)] sm:px-6 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
