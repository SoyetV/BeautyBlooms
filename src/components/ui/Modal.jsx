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
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Overlay background */}
      <div className="absolute inset-0 bg-brand-on-background/20 backdrop-blur-sm transition-opacity" />

      {/* Panel */}
      <div
        className={`relative z-10 w-full ${maxW[size]} max-h-[90vh] overflow-hidden rounded-3xl animate-scale-in border border-white/50`}
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-secondary/5">
          <h2 id="modal-title" className="font-display text-xl font-bold text-brand-on-surface">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-brand-on-surface-variant transition-all hover:bg-white/50 hover:text-brand-on-surface"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-6 scrollbar-none">
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
