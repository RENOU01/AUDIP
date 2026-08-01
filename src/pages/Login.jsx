import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Loader2, AlertCircle } from 'lucide-react'

export default function Login() {
  const { isAdmin, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  if (!loading && isAdmin) return <Navigate to="/admin" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)
    const { error } = await signIn(email, password)
    setEnviando(false)
    if (error) {
      setError('Email o contraseña incorrectos.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="min-h-[70vh] bg-signal-900 bg-grid-faint bg-grid flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm bg-signal-800 border border-signal-700 rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <Lock size={18} className="text-pulse-500" />
          <p className="eyebrow">Acceso administrador</p>
        </div>
        <h1 className="text-xl font-semibold text-white mb-6">Iniciar sesión</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-slate-300 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-signal-900 border border-signal-700 px-3 py-2.5 text-sm text-white focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-slate-300 mb-1.5">Contraseña</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-signal-900 border border-signal-700 px-3 py-2.5 text-sm text-white focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none"
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle size={15} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full flex items-center justify-center gap-2 bg-pulse-500 hover:bg-pulse-600 disabled:opacity-60 text-signal-900 font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {enviando && <Loader2 size={16} className="animate-spin" />}
            Ingresar
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-6">
          Los usuarios administradores se crean desde el panel de Supabase.
          Ver README.md del proyecto para instrucciones.
        </p>
      </div>
    </div>
  )
}
