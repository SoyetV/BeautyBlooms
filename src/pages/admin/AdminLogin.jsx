// src/pages/admin/AdminLogin.jsx

import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/Spinner'

export default function AdminLogin() {
  const { signIn, isAdmin, session } = useAuth()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  if (session && isAdmin) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 page-enter relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #500724 0%, #831843 50%, #2d1b2e 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #c08d4b, transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl text-3xl mb-4 animate-scale-in"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(236,72,153,0.2)',
            }}
            aria-hidden="true"
          >
            🌸
          </div>
          <h1
            className="font-display text-3xl font-bold tracking-tight"
            style={{ color: '#fdf2f8', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            Beauty Blooms
          </h1>
          <p className="text-sm font-light mt-1" style={{ color: 'rgba(253,242,248,0.6)' }}>
            Admin dashboard access
          </p>
        </div>

        {/* Glass form card */}
        <div
          className="rounded-3xl px-7 py-8 space-y-5"
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#fca5a5',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="label" style={{ color: 'rgba(253,242,248,0.7)' }}>Email</label>
              <input
                id="login-email" type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@bloom.ph"
                className="block w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder-white/30"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(253,242,248,0.95)',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(249,168,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <div>
              <label htmlFor="login-password" className="label" style={{ color: 'rgba(253,242,248,0.7)' }}>Password</label>
              <input
                id="login-password" type="password" autoComplete="current-password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-xl px-4 py-3 text-sm transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(253,242,248,0.95)',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(249,168,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                boxShadow: '0 4px 20px rgba(236,72,153,0.4)',
              }}
              disabled={loading}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 30px rgba(236,72,153,0.5)' }}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(236,72,153,0.4)'}
            >
              {loading ? <><Spinner size="sm" /> Signing in…</> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}