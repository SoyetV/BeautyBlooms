import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/Spinner'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="page-enter flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="card-glass p-8 md:p-12 text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl glass glow-bloom">
            <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>

          <h1 className="font-display text-3xl font-bold text-brand-on-surface mb-2">Atelier Access</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-10">Admin Dashboard Login</p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {error && (
              <div className="p-3 rounded-lg bg-brand-error/10 text-brand-error text-[11px] font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Atelier Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@beautyblooms.ph"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-xs tracking-[0.2em]"
            >
              {loading ? <Spinner size="sm" /> : 'ENTER ATELIER'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
           <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/40 hover:text-brand-primary transition-colors">
              Back to Storefront
           </Link>
        </div>
      </div>
    </div>
  )
}
