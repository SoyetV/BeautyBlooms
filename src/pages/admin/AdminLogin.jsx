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

  // Already signed in as admin → go straight to dashboard
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
    <div className="flex min-h-screen items-center justify-center bg-petal-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl" aria-hidden="true">🌸</span>
          <h1 className="font-display text-2xl font-bold text-bloom-600 mt-2">Bloom Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your shop.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="card px-6 py-7 space-y-5">
          {error && (
            <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="label">Email</label>
            <input
              id="login-email" type="email" autoComplete="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@bloom.ph"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="label">Password</label>
            <input
              id="login-password" type="password" autoComplete="current-password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? <><Spinner size="sm" /> Signing in…</> : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
