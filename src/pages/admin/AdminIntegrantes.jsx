import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { subirImagen } from '../../lib/storage'
import { Plus, Pencil, Trash2, X, Loader2, UserCircle2 } from 'lucide-react'

const vacio = {
  id: null,
  nombre: '',
  apellido: '',
  grupo_id: '',
  email: '',
  telefono: '',
  foto_url: '',
}

export default function AdminIntegrantes() {
  const [integrantes, setIntegrantes] = useState([])
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [fotoFile, setFotoFile] = useState(null)

  const cargar = async () => {
    setLoading(true)
    const [resInv, resGr] = await Promise.all([
      supabase.from('investigadores').select('*').order('apellido'),
      supabase.from('agrupaciones').select('id, nombre').order('nombre'),
    ])
    if (!resInv.error) setIntegrantes(resInv.data || [])
    if (!resGr.error) setGrupos(resGr.data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const abrirNuevo = () => { setEditando({ ...vacio }); setFotoFile(null) }
  const abrirEditar = (i) => { setEditando({ ...i }); setFotoFile(null) }
  const cerrar = () => setEditando(null)

  const nombreGrupo = (id) => grupos.find((g) => g.id === id)?.nombre || '—'

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      let foto_url = editando.foto_url
      if (fotoFile) foto_url = await subirImagen(fotoFile, 'fotos')

      const payload = {
        nombre: editando.nombre,
        apellido: editando.apellido,
        grupo_id: editando.grupo_id || null,
        email: editando.email,
        telefono: editando.telefono,
        foto_url,
      }

      if (editando.id) {
        const { error } = await supabase.from('investigadores').update(payload).eq('id', editando.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('investigadores').insert(payload)
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

  const eliminar = async (i) => {
    if (!confirm(`¿Dar de baja a ${i.nombre} ${i.apellido}?`)) return
    const { error } = await supabase.from('investigadores').delete().eq('id', i.id)
    if (error) alert('Error al eliminar: ' + error.message)
    else cargar()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-institutional-800">Integrantes</h2>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 bg-institutional-600 hover:bg-institutional-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Nuevo integrante
        </button>
      </div>

      {loading ? (
        <p className="text-institutional-700">Cargando…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrantes.map((i) => (
            <div key={i.id} className="bg-white border border-institutional-100 rounded-xl p-5 flex items-center gap-4">
              {i.foto_url ? (
                <img src={i.foto_url} alt="" className="h-12 w-12 rounded-full object-cover shrink-0" />
              ) : (
                <UserCircle2 size={48} className="text-institutional-100 shrink-0" strokeWidth={1} />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-institutional-800 truncate">{i.nombre} {i.apellido}</h3>
                <p className="text-sm text-institutional-600 truncate">{nombreGrupo(i.grupo_id)}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => abrirEditar(i)} className="p-1.5 text-institutional-600 hover:bg-institutional-50 rounded-md"><Pencil size={15} /></button>
                <button onClick={() => eliminar(i)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {integrantes.length === 0 && <p className="text-institutional-700">No hay integrantes cargados todavía.</p>}
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 bg-signal-900/60 flex items-start justify-center p-4 pt-8 z-50 overflow-y-auto">
          <form onSubmit={guardar} className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg my-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-institutional-800">
                {editando.id ? 'Editar integrante' : 'Nuevo integrante'}
              </h3>
              <button type="button" onClick={cerrar} className="text-institutional-500"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Campo label="Nombre" value={editando.nombre} onChange={(v) => setEditando({ ...editando, nombre: v })} required />
              <Campo label="Apellido" value={editando.apellido} onChange={(v) => setEditando({ ...editando, apellido: v })} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Grupo al que pertenece</label>
              <select
                value={editando.grupo_id || ''}
                onChange={(e) => setEditando({ ...editando, grupo_id: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >
                <option value="" disabled>Seleccioná un grupo</option>
                {grupos.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </div>

            <Campo label="Correo electrónico" type="email" value={editando.email} onChange={(v) => setEditando({ ...editando, email: v })} />
            <Campo label="Teléfono de contacto" value={editando.telefono} onChange={(v) => setEditando({ ...editando, telefono: v })} />

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Foto</label>
              <input type="file" accept="image/*" onChange={(e) => setFotoFile(e.target.files[0])} className="text-sm" />
              {editando.foto_url && !fotoFile && <img src={editando.foto_url} alt="Foto actual" className="h-14 w-14 rounded-full object-cover mt-2" />}
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
