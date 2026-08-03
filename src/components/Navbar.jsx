import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, ShieldCheck, Phone, Mail } from 'lucide-react'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/autoridades', label: 'Autoridades' },
  { to: '/mapa', label: 'Mapa de equipos' },
  { to: '/grupos', label: 'Grupos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior de contacto */}
      <div className="hidden sm:block bg-signal-950 border-b border-signal-800">
        <div className="max-w-6xl mx-auto px-5 h-9 flex items-center justify-end gap-5 text-xs text-slate-400">
          <a href="mailto:audipuruguay@gmail.com" className="flex items-center gap-1.5 hover:text-pulse-400 transition-colors">
            <Mail size={12} /> audipuruguay@gmail.com
          </a>
          <a href="tel:+59894724347" className="flex items-center gap-1.5 hover:text-pulse-400 transition-colors">
            <Phone size={12} /> +598 94 724 347
          </a>
        </div>
      </div>

      <div className="bg-signal-900/95 backdrop-blur border-b border-signal-700">
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <img src={`${import.meta.env.BASE_URL}logo-audip.jpg`} alt="AUDIP" className="h-9 w-auto" />
          <span className="font-brand font-bold tracking-wide text-white hidden sm:inline">
            AUDIP
          </span>
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-pulse-400 bg-white/5'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="tel:+59894724347"
            className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold bg-pulse-500 hover:bg-pulse-400 text-signal-900 transition-colors"
          >
            <Phone size={14} /> Llamar
          </a>
          <NavLink
            to="/login"
            className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium border border-signal-700 text-slate-300 hover:text-pulse-400 hover:border-pulse-500/50 transition-colors"
          >
            <ShieldCheck size={15} />
          </NavLink>
        </div>

        <button
          className="md:hidden text-slate-200 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-signal-700 bg-signal-900 px-5 pb-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 text-sm font-medium ${
                  isActive ? 'text-pulse-400' : 'text-slate-300'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a href="tel:+59894724347" className="flex items-center gap-1.5 py-2.5 text-sm font-medium text-pulse-400">
            <Phone size={15} /> +598 94 724 347
          </a>
          <NavLink
            to="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 py-2.5 text-sm font-medium text-slate-300"
          >
            <ShieldCheck size={15} />
            Administración
          </NavLink>
        </div>
      )}
      </div>
    </header>
  )
}
