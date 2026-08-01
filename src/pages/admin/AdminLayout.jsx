import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, Users, UserSquare2, MapPinned, Inbox } from 'lucide-react'

const tabs = [
  { to: '/admin', end: true, label: 'Agrupaciones', icon: MapPinned },
  { to: '/admin/integrantes', label: 'Integrantes', icon: Users },
  { to: '/admin/autoridades', label: 'Autoridades', icon: UserSquare2 },
  { to: '/admin/mensajes', label: 'Mensajes', icon: Inbox },
]

export default function AdminLayout() {
  const { signOut, session } = useAuth()

  return (
    <div className="min-h-[80vh] bg-institutional-50">
      <div className="bg-signal-900 border-b border-signal-700">
        <div className="max-w-6xl mx-auto px-5 py-6 flex items-center justify-between">
          <div>
            <p className="eyebrow mb-1">Panel de administración</p>
            <h1 className="text-xl font-semibold text-white">Hola, {session?.user?.email}</h1>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white border border-signal-700 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-wrap gap-1 py-4">
          {tabs.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-institutional-600 text-white' : 'bg-white text-institutional-700 border border-institutional-100'
                }`
              }
            >
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </div>

        <div className="pb-16">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
