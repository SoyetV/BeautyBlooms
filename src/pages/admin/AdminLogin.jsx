// src/pages/admin/AdminLogin.jsx

import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/Spinner'

export default function AdminLogin() {
  const { signIn, isAdmin, session, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [failedAttempts, setFailedAttempts] = useState(0)

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pattern">
        <Spinner size="lg" />
      </div>
    )
  }

  if (session && isAdmin) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      setFailedAttempts(0)
      navigate('/admin', { replace: true })
    } catch {
      setFailedAttempts(prev => prev + 1)
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8 pt-[96px] page-enter bg-pattern">
      <main className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="material-symbols-outlined text-primary text-5xl mb-4 icon-fill">
            local_florist
          </span>
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Beauty Blooms</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Sign in to the Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-petal transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-petal-hover hover:-translate-y-1">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {error && (
              <div role="alert" className="p-4 rounded-lg bg-error-container/60 border border-error/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-error icon-fill">error</span>
                <p className="font-body-md text-body-md text-on-error-container text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">mail</span>
                <input
                  id="login-email" type="email" autoComplete="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@beautyblooms.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="login-password">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
                <input
                  id="login-password" type="password" autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 mt-2"
              disabled={loading || failedAttempts >= 5}
            >
              {loading
                ? <><Spinner size="sm" /> Signing in…</>
                : failedAttempts >= 5
                  ? 'Refresh to retry'
                  : 'Sign In'}
            </button>
            {failedAttempts >= 5 && (
              <p className="text-center font-body-md text-body-md text-on-surface-variant text-sm">
                Too many failed attempts in this session.
              </p>
            )}
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Shop
          </a>
        </div>
      </main>
    </div>
  )
}