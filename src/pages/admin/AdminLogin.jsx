// src/pages/admin/AdminLogin.jsx
// Modern Flora — solid surface (no bg-pattern), centered card,
// uses Input primitive, accessible error state.

import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/Spinner'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  if (session && isAdmin) return <Navigate to="/admin" replace />

  const isLocked = failedAttempts >= 5

  async function handleSubmit(e) {
    e.preventDefault()
    if (isLocked) return
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
    <div className="page-enter min-h-screen flex flex-col items-center justify-center bg-background px-margin-mobile md:px-margin-desktop pt-24 pb-16">

      <main className="w-full max-w-md flex flex-col gap-8">

        {/* Brand header */}
        <header className="text-center animate-fade-in-up">
          <span
            className="material-symbols-outlined icon-fill text-primary-600 mb-4"
            style={{ fontSize: '40px' }}
            aria-hidden="true"
          >
            local_florist
          </span>
          <h1 className="font-display text-display-lg font-semibold text-foreground tracking-tight">
            Beauty Blooms
          </h1>
          <p className="text-body-md text-muted mt-2">
            Sign in to the admin dashboard
          </p>
        </header>

        {/* Login card */}
        <div className="card p-6 md:p-8 animate-fade-in-up">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg px-4 py-3 bg-error-soft border border-error/20"
              >
                <span
                  className="material-symbols-outlined icon-fill text-error-fg mt-0.5 shrink-0"
                  style={{ fontSize: '18px' }}
                  aria-hidden="true"
                >
                  error
                </span>
                <p className="text-body-sm text-error-fg">{error}</p>
              </div>
            )}

            <Input
              id="login-email"
              type="email"
              label="Email address"
              autoComplete="email"
              required
              placeholder="admin@beautyblooms.ph"
              value={email}
              onChange={e => setEmail(e.target.value)}
              iconLeft="mail"
            />

            <Input
              id="login-password"
              type="password"
              label="Password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              iconLeft="lock"
            />

            <Button
              type="submit"
              size="lg"
              className="w-full justify-center"
              loading={loading}
              disabled={isLocked}
              aria-busy={loading || undefined}
            >
              {isLocked ? 'Refresh to retry' : 'Sign in'}
            </Button>

            {isLocked && (
              <p className="text-center text-body-sm text-muted">
                Too many failed attempts in this session.
              </p>
            )}
          </form>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-body-sm text-muted hover:text-foreground transition-colors duration-250 ease-smooth"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">arrow_back</span>
            Return to shop
          </Link>
        </div>
      </main>
    </div>
  )
}
