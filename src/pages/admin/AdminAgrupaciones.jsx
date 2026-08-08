import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { subirImagen } from '../../lib/storage'
import { AREAS, DEPARTAMENTOS, coordsDeDepartamento } from '../../lib/departamentos'
import { BARRIOS_MONTEVIDEO, coordsDeBarrioMontevideo } from '../../lib/barriosMontevideo'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'

const vacio = {
  id: null,
  nombre: '',
  area: 'paranormal',
  fecha_fundacion: '',
  cantidad_integrantes: '',
  departamento: '',
  barrio: '',
  telefono: '',
  email: '',
  investigador_a_cargo: '',
  logo_url: '',
  imagen_institucional_url: '',
  latitud: '',
  longitud: '',
}

export default function AdminAgrupaciones() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null) // null = cerrado, vacio-like = form abierto
  const [guardando, setGuardando] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [imagenFile, setImagenFile] = useState(null)

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('agrupaciones').select('*').order('nombre')
    if (!error) setGrupos(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const abrirNuevo = () => { setEditando({ ...vacio }); setLogoFile(null); setImagenFile(null) }
  const abrirEditar = (g) => { setEditando({ ...g, fecha_fundacion: g.fecha_fundacion || '' }); setLogoFile(null); setImagenFile(null) }
  const cerrar = () => setEditando(null)

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      let logo_url = editando.logo_url
      let imagen_institucional_url = editando.imagen_institucional_url
      if (logoFile) logo_url = await subirImagen(logoFile, 'logos')
      if (imagenFile) imagen_institucional_url = await subirImagen(imagenFile, 'institucionales')

      const payload = {
        nombre: editando.nombre,
        area: editando.area,
        fecha_fundacion: editando.fecha_fundacion || null,
        cantidad_integrantes: editando.cantidad_integrantes ? Number(editando.cantidad_integrantes) : null,
        departamento: editando.departamento,
        barrio: editando.barrio || null,
        telefono: editando.telefono,
        email: editando.email,
        investigador_a_cargo: editando.investigador_a_cargo,
        logo_url,
        imagen_institucional_url,
        latitud: editando.latitud !== '' ? Number(editando.latitud) : null,
        longitud: editando.longitud !== '' ? Number(editando.longitud) : null,
      }

      if (editando.id) {
        const { error } = await supabase.from('agrupaciones').update(payload).eq('id', editando.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('agrupaciones').insert(payload)
        if (error) throw error
      }

      await cargar()
      cerrar()
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (g) => {
    if (!confirm(`¿Dar de baja el grupo "${g.nombre}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('agrupaciones').delete().eq('id', g.id)
    if (error) alert('Error al eliminar: ' + error.message)
    else cargar()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-institutional-800">Agrupaciones</h2>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 bg-institutional-600 hover:bg-institutional-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Nueva agrupación
        </button>
      </div>

      {loading ? (
        <p className="text-institutional-700">Cargando…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grupos.map((g) => (
            <div key={g.id} className="bg-white border border-institutional-100 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-institutional-800">{g.nombre}</h3>
                <div className="flex gap-1">
                  <button onClick={() => abrirEditar(g)} className="p-1.5 text-institutional-600 hover:bg-institutional-50 rounded-md"><Pencil size={15} /></button>
                  <button onClick={() => eliminar(g)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={15} /></button>
                </div>
              </div>
              <p className="text-sm text-institutional-600 capitalize">{g.area} · {g.departamento}</p>
              {g.investigador_a_cargo && <p className="text-sm text-institutional-500 mt-1">A cargo: {g.investigador_a_cargo}</p>}
            </div>
          ))}
          {grupos.length === 0 && <p className="text-institutional-700">No hay agrupaciones cargadas todavía.</p>}
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 bg-signal-900/60 flex items-start justify-center p-4 pt-8 z-50 overflow-y-auto">
          <form onSubmit={guardar} className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg my-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-institutional-800">
                {editando.id ? 'Editar agrupación' : 'Nueva agrupación'}
              </h3>
              <button type="button" onClick={cerrar} className="text-institutional-500"><X size={20} /></button>
            </div>

            <Campo label="Nombre" value={editando.nombre} onChange={(v) => setEditando({ ...editando, nombre: v })} required />

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Área</label>
              <select
                value={editando.area}
                onChange={(e) => setEditando({ ...editando, area: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >
                {AREAS.map((a) => <option key={a.valor} value={a.valor}>{a.etiqueta}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Departamento</label>
              <select
                value={editando.departamento}
                onChange={(e) => {
                  const coords = coordsDeDepartamento(e.target.value)
                  setEditando({
                    ...editando,
                    departamento: e.target.value,
                    latitud: coords?.lat ?? editando.latitud,
                    longitud: coords?.lng ?? editando.longitud,
                  })
                }}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >
                <option value="" disabled>Seleccioná un departamento</option>
                {DEPARTAMENTOS.map((d) => <option key={d.nombre} value={d.nombre}>{d.nombre}</option>)}
              </select>
              <p className="text-xs text-institutional-500 mt-1">Al elegirlo, la ubicación en el mapa se completa sola — podés afinarla abajo con el barrio o las coordenadas exactas.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Barrio o zona (opcional)</label>
              <input
                value={editando.barrio}
                onChange={(e) => {
                  const nuevoBarrio = e.target.value
                  const coordsBarrio =
                    editando.departamento === 'Montevideo' ? coordsDeBarrioMontevideo(nuevoBarrio) : null
                  setEditando({
                    ...editando,
                    barrio: nuevoBarrio,
                    ...(coordsBarrio ? { latitud: coordsBarrio.lat, longitud: coordsBarrio.lng } : {}),
                  })
                }}
                list="barrios-montevideo-datalist"
                placeholder={editando.departamento === 'Montevideo' ? 'Ej: Pocitos, Carrasco…' : 'Ej: nombre de la zona'}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
              {editando.departamento === 'Montevideo' && (
                <>
                  <datalist id="barrios-montevideo-datalist">
                    {BARRIOS_MONTEVIDEO.map((b) => <option key={b.nombre} value={b.nombre} />)}
                  </datalist>
                  <p className="text-xs text-institutional-500 mt-1">
                    Si el barrio coincide con uno de la lista sugerida, la ubicación en el mapa se ajusta sola.
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Campo label="Latitud (GPS)" type="number" value={editando.latitud} onChange={(v) => setEditando({ ...editando, latitud: v })} />
              <Campo label="Longitud (GPS)" type="number" value={editando.longitud} onChange={(v) => setEditando({ ...editando, longitud: v })} />
            </div>
            <p className="text-xs text-institutional-500 -mt-2">
              Tip: para una ubicación exacta, buscá la dirección en Google Maps, mantené presionado el punto en el mapa y copiá las coordenadas que aparecen (ej: -34.9011, -56.1645).
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Campo label="Fecha de fundación" type="date" value={editando.fecha_fundacion} onChange={(v) => setEditando({ ...editando, fecha_fundacion: v })} />
              <Campo label="Cantidad de integrantes" type="number" value={editando.cantidad_integrantes} onChange={(v) => setEditando({ ...editando, cantidad_integrantes: v })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Campo label="Teléfono de contacto" value={editando.telefono} onChange={(v) => setEditando({ ...editando, telefono: v })} />
              <Campo label="Correo electrónico" type="email" value={editando.email} onChange={(v) => setEditando({ ...editando, email: v })} />
            </div>

            <Campo label="Investigador a cargo" value={editando.investigador_a_cargo} onChange={(v) => setEditando({ ...editando, investigador_a_cargo: v })} />

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Logo del grupo</label>
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="text-sm" />
              {editando.logo_url && !logoFile && <img src={editando.logo_url} alt="Logo actual" className="h-12 mt-2 rounded" />}
            </div>

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Imagen institucional adjunta</label>
              <input type="file" accept="image/*" onChange={(e) => setImagenFile(e.target.files[0])} className="text-sm" />
              {editando.imagen_institucional_url && !imagenFile && <img src={editando.imagen_institucional_url} alt="Imagen actual" className="h-20 mt-2 rounded" />}
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="w-full flex items-center justify-center gap-2 bg-institutional-600 hover:bg-institutional-700 disabled:opacity-60 text-white font-medium px-4 py-2.5 rounded-lg"
            >
              {guardando && <Loader2 size={16} className="animate-spin" />}
              Guardar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function Campo({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-institutional-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
      />
    </div>
  )
}
