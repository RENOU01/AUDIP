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
      <div className="bg-institutional-800">
        <div className="max-w-6xl mx-auto px-5 h-9 flex items-center justify-end gap-5 text-xs text-slate-300">
          <a href="mailto:audipuruguay@gmail.com" className="hidden sm:flex items-center gap-1.5 hover:text-pulse-400 transition-colors">
            <Mail size={12} /> audipuruguay@gmail.com
          </a>
          <a href="tel:+59894724347" className="flex items-center gap-1.5 hover:text-pulse-400 transition-colors font-medium">
            <Phone size={12} /> +598 94 724 347
          </a>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <img src={`${import.meta.env.BASE_URL}logo-audip.jpg`} alt="AUDIP" className="h-9 w-auto rounded-md" />
            <span className="font-brand font-bold tracking-wide text-institutional-800 hidden sm:inline">
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
                  `px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'text-institutional-700 border-pulse-500'
                      : 'text-slate-600 border-transparent hover:text-institutional-700 hover:border-institutional-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href="tel:+59894724347"
              className="ml-3 flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold bg-institutional-600 hover:bg-institutional-700 text-white transition-colors"
            >
              <Phone size={14} /> Llamar
            </a>
            <NavLink
              to="/login"
              className="ml-1 flex items-center gap-1.5 p-2 rounded-md text-slate-500 hover:text-institutional-700 hover:bg-institutional-50 transition-colors"
              aria-label="Administración"
            >
              <ShieldCheck size={17} />
            </NavLink>
          </div>

          <button
            className="md:hidden text-institutional-700 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden border-t border-slate-200 bg-white px-5 pb-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 text-sm font-medium ${
                    isActive ? 'text-institutional-700' : 'text-slate-600'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a href="tel:+59894724347" className="flex items-center gap-1.5 py-2.5 text-sm font-medium text-institutional-700">
              <Phone size={15} /> +598 94 724 347
            </a>
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 py-2.5 text-sm font-medium text-slate-600"
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
