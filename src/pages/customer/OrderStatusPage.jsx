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

    setLoading(false)
  }, [id, token])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-[80px]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="page-enter relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-8 sm:py-16 pt-[120px]">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-fixed opacity-30 blur-[100px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-secondary-fixed opacity-20 blur-[120px] pointer-events-none z-[-1]"></div>

      <Link
        to="/catalog"
        className="group mb-7 inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full transition-all group-hover:-translate-x-1 border border-outline-variant bg-surface/80">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </span>
        Return to Shop
      </Link>

      {validOrder ? (
        <section className="max-w-4xl mx-auto mb-24 animate-fade-in-up">
          <div className="glass-panel rounded-[2rem] p-6 md:p-12 relative overflow-hidden">
            {/* Decorative flower silhouette in background */}
            <span className="material-symbols-outlined absolute -right-12 -top-12 text-[200px] text-primary/5 select-none pointer-events-none transform rotate-12">local_florist</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
              {/* Order Details */}
              <div className="flex flex-col space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container text-[32px] icon-fill">check_circle</span>
                  </div>
                  <div>
                    <h1 className="font-headline-sm text-headline-sm text-primary m-0">Order Confirmed</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Order #{id} • Placed today</p>
                  </div>
                </div>
                <div className="bg-surface-container/50 rounded-xl p-6 border border-primary/10">
                  <h2 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4">Status Overview</h2>
                  {/* Timeline */}
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-surface-variant">
                    <div className="relative">
                      <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-primary border-4 border-surface-container-low z-10"></div>
                      <h3 className="font-body-md text-body-md text-on-surface font-semibold">Order Placed</h3>
                      <p className="font-body-md text-body-md text-outline text-sm mt-1">Receipt confirmed</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-primary border-4 border-surface-container-low z-10"></div>
                      <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-primary animate-ping opacity-75"></div>
                      <h3 className="font-body-md text-body-md text-primary font-semibold">Being Prepared</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">Our artisans are carefully selecting and arranging your blooms.</p>
                    </div>
                    <div className="relative opacity-50">
                      <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-surface-variant border-4 border-surface-container-low z-10"></div>
                      <h3 className="font-body-md text-body-md text-on-surface-variant font-semibold">Out for Delivery</h3>
                      <p className="font-body-md text-body-md text-outline text-sm mt-1">Pending</p>
                    </div>
                    <div className="relative opacity-50">
                      <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-surface-variant border-4 border-surface-container-low z-10"></div>
                      <h3 className="font-body-md text-body-md text-on-surface-variant font-semibold">Delivered</h3>
                      <p className="font-body-md text-body-md text-outline text-sm mt-1">Estimated soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking token card */}
              <div className="glass-card rounded-xl p-6 h-full">
                <h2 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-primary/10 pb-4">Tracking Token</h2>
                <p className="font-body-md text-body-md text-on-surface-variant break-all">{token}</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-6">
                  Save this token — you'll need it to track your order in future visits. We'll notify you when your blooms are on the way.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-2xl mx-auto animate-fade-in-up">
          <div className="bg-error-container/50 backdrop-blur-md border border-error/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-error text-[32px] icon-fill">search_off</span>
            </div>
            <h1 className="font-headline-sm text-headline-sm text-on-error-container mb-2">Order Not Found</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md">
              We couldn't locate an order with ID <strong>#{id}</strong>. Please check the number and try again, or contact our boutique for assistance.
            </p>
            <Link to="/catalog" className="bg-secondary text-on-secondary rounded-full px-6 py-2 font-label-md text-label-md hover:opacity-90 transition-opacity">
              Return to Catalog
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}