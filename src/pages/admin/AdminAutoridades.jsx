import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { subirImagen } from '../../lib/storage'
import { Plus, Pencil, Trash2, X, Loader2, UserCircle2 } from 'lucide-react'

const vacio = { id: null, nombre: '', cargo: '', orden: 0, foto_url: '', investigador_id: '' }

export default function AdminAutoridades() {
  const [autoridades, setAutoridades] = useState([])
  const [integrantes, setIntegrantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [fotoFile, setFotoFile] = useState(null)

  const cargar = async () => {
    setLoading(true)
    const [resAut, resInv] = await Promise.all([
      supabase.from('autoridades').select('*').order('orden'),
      supabase.from('investigadores').select('id, nombre, apellido, foto_url').order('apellido'),
    ])
    if (!resAut.error) setAutoridades(resAut.data || [])
    if (!resInv.error) setIntegrantes(resInv.data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const vincularIntegrante = (id) => {
    if (!id) {
      setEditando({ ...editando, investigador_id: '' })
      return
    }
    const integrante = integrantes.find((i) => i.id === id)
    setEditando({
      ...editando,
      investigador_id: id,
      nombre: integrante ? `${integrante.nombre} ${integrante.apellido}` : editando.nombre,
      foto_url: integrante?.foto_url || editando.foto_url,
    })
    setFotoFile(null)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      let foto_url = editando.foto_url
      if (fotoFile) foto_url = await subirImagen(fotoFile, 'autoridades')

      const payload = {
        nombre: editando.nombre,
        cargo: editando.cargo,
        orden: Number(editando.orden) || 0,
        foto_url,
        investigador_id: editando.investigador_id || null,
      }

      if (editando.id) {
        const { error } = await supabase.from('autoridades').update(payload).eq('id', editando.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('autoridades').insert(payload)
        if (error) throw error
      }
      await cargar()
      setEditando(null)
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (a) => {
    if (!confirm(`¿Quitar a ${a.nombre} de autoridades?`)) return
    const { error } = await supabase.from('autoridades').delete().eq('id', a.id)
    if (error) alert('Error al eliminar: ' + error.message)
    else cargar()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-institutional-800">Autoridades</h2>
        <button
          onClick={() => { setEditando({ ...vacio }); setFotoFile(null) }}
          className="flex items-center gap-2 bg-institutional-600 hover:bg-institutional-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Nueva autoridad
        </button>
      </div>

      {loading ? <p className="text-institutional-700">Cargando…</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {autoridades.map((a) => (
            <div key={a.id} className="bg-white border border-institutional-100 rounded-xl p-5 flex items-center gap-4">
              {a.foto_url ? (
                <img src={a.foto_url} alt="" className="h-12 w-12 rounded-full object-cover shrink-0" />
              ) : (
                <UserCircle2 size={48} className="text-institutional-100 shrink-0" strokeWidth={1} />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-institutional-800 truncate">{a.nombre}</h3>
                <p className="text-sm text-institutional-600 truncate">{a.cargo}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setEditando({ ...a }); setFotoFile(null) }} className="p-1.5 text-institutional-600 hover:bg-institutional-50 rounded-md"><Pencil size={15} /></button>
                <button onClick={() => eliminar(a)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {autoridades.length === 0 && <p className="text-institutional-700">No hay autoridades cargadas todavía.</p>}
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 bg-signal-900/60 flex items-start justify-center p-4 pt-8 z-50 overflow-y-auto">
          <form onSubmit={guardar} className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md my-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-institutional-800">
                {editando.id ? 'Editar autoridad' : 'Nueva autoridad'}
              </h3>
              <button type="button" onClick={() => setEditando(null)} className="text-institutional-500"><X size={20} /></button>
            </div>

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Vincular con un integrante (opcional)</label>
              <select
                value={editando.investigador_id || ''}
                onChange={(e) => vincularIntegrante(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              >
                <option value="">— Cargar nombre y foto a mano —</option>
                {integrantes.map((i) => (
                  <option key={i.id} value={i.id}>{i.nombre} {i.apellido}</option>
                ))}
              </select>
              <p className="text-xs text-institutional-500 mt-1">
                Si elegís a alguien de la lista, el nombre y la foto se completan solos desde su ficha de integrante (los podés seguir editando abajo si hace falta).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Nombre y apellido</label>
              <input required value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Cargo</label>
              <input required value={editando.cargo} onChange={(e) => setEditando({ ...editando, cargo: e.target.value })} placeholder="Ej: Presidenta, Secretario General…" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Orden de aparición</label>
              <input type="number" value={editando.orden} onChange={(e) => setEditando({ ...editando, orden: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-institutional-700 mb-1.5">Foto</label>
              <input type="file" accept="image/*" onChange={(e) => setFotoFile(e.target.files[0])} className="text-sm" />
              {editando.foto_url && !fotoFile && <img src={editando.foto_url} alt="Foto actual" className="h-14 w-14 rounded-full object-cover mt-2" />}
            </div>

            <button type="submit" disabled={guardando} className="w-full flex items-center justify-center gap-2 bg-institutional-600 hover:bg-institutional-700 disabled:opacity-60 text-white font-medium px-4 py-2.5 rounded-lg">
              {guardando && <Loader2 size={16} className="animate-spin" />}
              Guardar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
