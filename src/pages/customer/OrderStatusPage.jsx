import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'

export default function OrderStatusPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [loading, setLoading] = useState(true)
  const [validOrder, setValidOrder] = useState(false)

  useEffect(() => {
    const lastOrderId = localStorage.getItem('lastOrderId')
    const lastOrderToken = localStorage.getItem('lastOrderToken')

    if (id && token && lastOrderId === id && lastOrderToken === token) {
      setValidOrder(true)
    }

    setTimeout(() => setLoading(false), 800)
  }, [id, token])

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="page-enter pt-32 pb-24 mx-auto max-w-3xl px-6 text-center">
       {validOrder ? (
         <div className="space-y-12">
            <div className="animate-scale-in">
               <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full glass glow-bloom">
                  <svg className="h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
               <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-on-surface">Ordered with <span className="italic font-light">Elegance</span></h1>
               <p className="mt-6 text-brand-on-surface-variant font-light leading-relaxed max-w-md mx-auto">
                 Your request is being curated by our head floral designer. We will contact you shortly via messenger to confirm delivery timing.
               </p>
            </div>

            <div className="card-glass p-8 space-y-6">
               <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-on-surface-variant">
                  <span>Order Reference</span>
                  <span className="text-brand-on-surface">#{id?.slice(0, 8)}</span>
               </div>
               <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-on-surface-variant">
                  <span>Tracking Token</span>
                  <span className="text-brand-on-surface truncate ml-8">{token?.slice(0, 12)}...</span>
               </div>
            </div>

            <div className="pt-8">
               <Link to="/catalog" className="btn-primary">
                 Return to Collection
               </Link>
            </div>
         </div>
       ) : (
         <div className="space-y-8 animate-fade-in">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand-error/10 text-brand-error">
               <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
               </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-brand-on-surface">Order Not Found</h1>
            <p className="text-brand-on-surface-variant font-light max-w-sm mx-auto">
              We couldn't locate your floral selection in this session. Please check your confirmation link or browse our collection again.
            </p>
            <Link to="/catalog" className="btn-secondary">
              Back to Catalog
            </Link>
         </div>
       )}
    </div>
  )
}
