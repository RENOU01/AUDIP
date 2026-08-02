import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { supabase } from '../supabaseClient'
import { AREAS } from '../lib/departamentos'
import { Mail, Phone } from 'lucide-react'

const CENTRO_URUGUAY = [-32.9, -56.0]

export default function Mapa() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    let activo = true
    supabase
      .from('agrupaciones')
      .select('*')
      .order('nombre', { ascending: true })
      .then(({ data, error }) => {
        if (!activo) return
        if (!error) setGrupos(data || [])
        setLoading(false)
      })
    return () => { activo = false }
  }, [])

  const grupoVisible = useMemo(
    () => (filtro === 'todas' ? grupos : grupos.filter((g) => g.area === filtro)),
    [grupos, filtro]
  )

  // Si varios grupos comparten departamento (mismas coordenadas), los separamos
  // levemente en un pequeño círculo para que no queden apilados en el mapa.
  const posicionesAjustadas = useMemo(() => {
    const porCoordenada = new Map()
    grupoVisible.forEach((g) => {
      if (g.latitud == null || g.longitud == null) return
      const clave = `${g.latitud},${g.longitud}`
      if (!porCoordenada.has(clave)) porCoordenada.set(clave, [])
      porCoordenada.get(clave).push(g)
    })

    const resultado = new Map()
    porCoordenada.forEach((lista) => {
      const radio = 0.045
      lista.forEach((g, i) => {
        if (lista.length === 1) {
          resultado.set(g.id, [g.latitud, g.longitud])
        } else {
          const angulo = (2 * Math.PI * i) / lista.length
          resultado.set(g.id, [
            g.latitud + radio * Math.cos(angulo),
            g.longitud + radio * Math.sin(angulo),
          ])
        }
      })
    })
    return resultado
  }, [grupoVisible])

  const colorDeArea = (area) => AREAS.find((a) => a.valor === area)?.color || '#1B3A6B'

  return (
    <div className="bg-paper min-h-[70vh]">
      <div className="bg-signal-900 bg-grid-faint bg-grid hero-glow py-16">
        <div className="max-w-6xl mx-auto px-5">
          <p className="eyebrow mb-2">Cobertura nacional</p>
          <h1 className="text-3xl font-semibold text-white">Mapa de equipos de investigación</h1>
          <p className="text-slate-300 mt-3 max-w-2xl">
            Ubicación de los equipos activos de AUDIP en el territorio uruguayo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          <FiltroBtn activo={filtro === 'todas'} onClick={() => setFiltro('todas')}>
            Todas las áreas
          </FiltroBtn>
          {AREAS.map((a) => (
            <FiltroBtn key={a.valor} activo={filtro === a.valor} onClick={() => setFiltro(a.valor)} color={a.color}>
              {a.etiqueta}
            </FiltroBtn>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-institutional-100 shadow-sm">
          <MapContainer center={CENTRO_URUGUAY} zoom={7} scrollWheelZoom={false} style={{ height: '520px', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {grupoVisible
              .filter((g) => g.latitud && g.longitud)
              .map((g) => (
                <CircleMarker
                  key={g.id}
                  center={posicionesAjustadas.get(g.id)}
                  radius={9}
                  pathOptions={{ color: colorDeArea(g.area), fillColor: colorDeArea(g.area), fillOpacity: 0.85, weight: 2 }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold text-institutional-800">{g.nombre}</p>
                      <p className="text-institutional-600 mb-1">{g.barrio ? `${g.barrio}, ${g.departamento}` : g.departamento}</p>
                      {g.email && (
                        <a href={`mailto:${g.email}`} className="flex items-center gap-1 text-institutional-700 hover:underline">
                          <Mail size={12} /> {g.email}
                        </a>
                      )}
                      {g.telefono && (
                        <a href={`tel:${g.telefono}`} className="flex items-center gap-1 text-institutional-700 hover:underline">
                          <Phone size={12} /> {g.telefono}
                        </a>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
        </div>

        {!loading && grupoVisible.length === 0 && (
          <p className="text-institutional-700 mt-6">No hay equipos cargados para este filtro todavía.</p>
        )}

        {/* Listado accesible en texto, para quienes no puedan usar el mapa */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grupoVisible.map((g) => (
            <div key={g.id} className="card-surface p-5">
              <span
                className="inline-block text-xs font-mono uppercase tracking-wide px-2 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: `${colorDeArea(g.area)}22`, color: colorDeArea(g.area) }}
              >
                {AREAS.find((a) => a.valor === g.area)?.etiqueta || g.area}
              </span>
              <h3 className="font-serif font-semibold text-institutional-800">{g.nombre}</h3>
              <p className="text-sm text-institutional-600 mb-2">{g.barrio ? `${g.barrio}, ${g.departamento}` : g.departamento}</p>
              {g.email && <p className="text-sm text-institutional-700">{g.email}</p>}
              {g.telefono && <p className="text-sm text-institutional-700">{g.telefono}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FiltroBtn({ children, activo, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        activo
          ? 'bg-institutional-600 border-institutional-600 text-white'
          : 'bg-white border-institutional-100 text-institutional-700 hover:border-institutional-600'
      }`}
      style={activo && color ? { backgroundColor: color, borderColor: color } : undefined}
    >
      {children}
    </button>
  )
}
