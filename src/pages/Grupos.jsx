import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { AREAS } from '../lib/departamentos'
import { UserCircle2, Users } from 'lucide-react'

export default function Grupos() {
  const [agrupaciones, setAgrupaciones] = useState([])
  const [investigadores, setInvestigadores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let activo = true
    Promise.all([
      supabase.from('agrupaciones').select('*').order('nombre'),
      supabase.from('investigadores').select('*').order('apellido'),
    ]).then(([resAgr, resInv]) => {
      if (!activo) return
      if (!resAgr.error) setAgrupaciones(resAgr.data || [])
      if (!resInv.error) setInvestigadores(resInv.data || [])
      setLoading(false)
    })
    return () => { activo = false }
  }, [])

  return (
    <div className="bg-paper min-h-[70vh]">
      <div className="bg-signal-900 bg-grid-faint bg-grid hero-glow py-16">
        <div className="max-w-6xl mx-auto px-5">
          <p className="eyebrow mb-2">Nuestra gente</p>
          <h1 className="text-3xl font-semibold text-white">Grupos integrantes</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-14 space-y-16">
        {loading && <p className="text-institutional-700">Cargando grupos…</p>}

        {!loading && AREAS.map((area) => {
          const grupos = agrupaciones.filter((g) => g.area === area.valor)
          if (grupos.length === 0) return null
          return (
            <div key={area.valor}>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: area.color }} />
                <h2 className="text-2xl font-semibold text-institutional-800">{area.etiqueta}</h2>
              </div>

              <div className="space-y-8">
                {grupos.map((g) => (
                  <GrupoCard key={g.id} grupo={g} integrantes={investigadores.filter((i) => i.grupo_id === g.id)} />
                ))}
              </div>
            </div>
          )
        })}

        {!loading && agrupaciones.length === 0 && (
          <p className="text-institutional-700">
            Todavía no hay grupos cargados. El administrador puede agregarlos desde el panel.
          </p>
        )}
      </div>
    </div>
  )
}

function GrupoCard({ grupo, integrantes }) {
  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
        {grupo.logo_url ? (
          <img src={grupo.logo_url} alt={`Logo de ${grupo.nombre}`} className="h-16 w-16 rounded-lg object-cover border border-institutional-100" />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-institutional-50 flex items-center justify-center text-institutional-600">
            <Users size={26} />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-serif text-xl font-semibold text-institutional-800">{grupo.nombre}</h3>
          <p className="text-sm text-institutional-600">
            {grupo.departamento}
            {grupo.fecha_fundacion && ` · Desde ${new Date(grupo.fecha_fundacion).getFullYear()}`}
            {grupo.cantidad_integrantes ? ` · ${grupo.cantidad_integrantes} integrantes` : ''}
          </p>
        </div>
      </div>

      {grupo.imagen_institucional_url && (
        <img
          src={grupo.imagen_institucional_url}
          alt={`Imagen institucional de ${grupo.nombre}`}
          className="w-full max-h-72 object-cover rounded-xl mb-6"
        />
      )}

      {integrantes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {integrantes.map((i) => (
            <div key={i.id} className="text-center">
              {i.foto_url ? (
                <img src={i.foto_url} alt={`${i.nombre} ${i.apellido}`} className="h-20 w-20 mx-auto rounded-full object-cover mb-2" />
              ) : (
                <UserCircle2 size={80} className="mx-auto text-institutional-100 mb-2" strokeWidth={1} />
              )}
              <p className="text-sm font-medium text-institutional-800">{i.nombre} {i.apellido}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
