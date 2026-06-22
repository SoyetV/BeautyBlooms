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
      <div className="flex min-h-screen items-center justify-center bg-bloom-950">
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
    <div className="flex min-h-screen items-center justify-center px-4 page-enter bg-surface">
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl text-3xl mb-4 bg-primary/10 text-primary shadow-sm border border-primary/20 animate-scale-in">
            🌸
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            Beauty Blooms
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Admin dashboard access
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-3xl px-7 py-8 space-y-5 bg-surface-container shadow-md border border-outline/20">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <div role="alert" className="rounded-xl px-4 py-3 font-body-sm text-body-sm bg-error/10 text-error border border-error/20">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="label text-on-surface-variant">Email</label>
              <input
                id="login-email" type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@bloom.ph"
                className="input-field bg-surface text-on-surface border-outline/30 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="label text-on-surface-variant">Password</label>
              <input
                id="login-password" type="password" autoComplete="current-password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field bg-surface text-on-surface border-outline/30 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
              disabled={loading || failedAttempts >= 5}
            >
              {loading ? <><Spinner size="sm" /> Signing in…</> : failedAttempts >= 5 ? 'Refresh to retry' : 'Sign in'}
            </button>
            {failedAttempts >= 5 && (
              <p className="text-center font-body-xs text-body-xs text-on-surface-variant">
                Too many failed attempts in this session.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
