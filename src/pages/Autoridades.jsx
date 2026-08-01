import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { UserCircle2 } from 'lucide-react'

export default function Autoridades() {
  const [autoridades, setAutoridades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let activo = true
    supabase
      .from('autoridades')
      .select('*')
      .order('orden', { ascending: true })
      .then(({ data, error }) => {
        if (!activo) return
        if (!error) setAutoridades(data || [])
        setLoading(false)
      })
    return () => { activo = false }
  }, [])

  return (
    <div className="bg-paper min-h-[70vh]">
      <div className="bg-signal-900 bg-grid-faint bg-grid hero-glow py-16">
        <div className="max-w-6xl mx-auto px-5">
          <p className="eyebrow mb-2">Institucional</p>
          <h1 className="text-3xl font-semibold text-white">Autoridades</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-14">
        {loading && <p className="text-institutional-700">Cargando autoridades…</p>}

        {!loading && autoridades.length === 0 && (
          <p className="text-institutional-700">
            Aún no hay autoridades cargadas. El administrador puede agregarlas desde el panel.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {autoridades.map((a) => (
            <div key={a.id} className="card-surface p-6 flex items-center gap-4">
              {a.foto_url ? (
                <img src={a.foto_url} alt={a.nombre} className="h-16 w-16 rounded-full object-cover shrink-0" />
              ) : (
                <UserCircle2 size={64} className="text-institutional-100 shrink-0" strokeWidth={1} />
              )}
              <div>
                <h3 className="font-serif font-semibold text-institutional-800">{a.nombre}</h3>
                <p className="text-sm text-institutional-600">{a.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
