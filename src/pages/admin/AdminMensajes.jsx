import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Trash2, Mail, Phone } from 'lucide-react'

export default function AdminMensajes() {
  const [mensajes, setMensajes] = useState([])
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contactos')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setMensajes(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const eliminar = async (m) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    const { error } = await supabase.from('contactos').delete().eq('id', m.id)
    if (error) alert('Error al eliminar: ' + error.message)
    else cargar()
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-institutional-800 mb-5">Mensajes recibidos</h2>

      {loading ? (
        <p className="text-institutional-700">Cargando…</p>
      ) : mensajes.length === 0 ? (
        <p className="text-institutional-700">No hay mensajes todavía.</p>
      ) : (
        <div className="space-y-4">
          {mensajes.map((m) => (
            <div key={m.id} className="bg-white border border-institutional-100 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-institutional-800">{m.nombre}</h3>
                  <p className="text-xs text-institutional-500 font-mono">
                    {new Date(m.created_at).toLocaleString('es-UY')} · {m.departamento}
                  </p>
                </div>
                <button onClick={() => eliminar(m)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md shrink-0"><Trash2 size={15} /></button>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-institutional-600">
                <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 hover:underline"><Mail size={13} /> {m.email}</a>
                {m.telefono && <a href={`tel:${m.telefono}`} className="flex items-center gap-1.5 hover:underline"><Phone size={13} /> {m.telefono}</a>}
              </div>
              <p className="text-sm text-institutional-700 mt-3 whitespace-pre-wrap">{m.mensaje}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
