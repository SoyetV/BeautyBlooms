// src/components/ui/Modal.jsx
// Modern Flora — solid surface panel (not glass), portal-rendered to dodge
// ancestor transforms, accessible focus + escape behavior.

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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 py-4 sm:items-center sm:px-4 sm:py-8
                 bg-foreground/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Panel */}
      <div
        className={`relative z-10 w-full ${maxW[size]} max-h-[calc(100vh-2rem)] overflow-hidden
                    rounded-2xl bg-surface border border-border shadow-xl
                    animate-fade-in-up
                    sm:max-h-[calc(100vh-4rem)]`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-surface border-b border-border">
          <h2 id="modal-title" className="font-display text-display-sm font-semibold text-foreground">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full text-muted
                       hover:bg-surface-2 hover:text-foreground transition-colors duration-250 ease-smooth
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }} aria-hidden="true">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5">
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
