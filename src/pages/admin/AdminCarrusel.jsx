import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { subirImagen } from '../../lib/storage'
import { Upload, Trash2, Loader2, ImageIcon, Info } from 'lucide-react'

export default function AdminCarrusel() {
  const [imagenes, setImagenes] = useState({}) // { [orden]: url }
  const [cantidad, setCantidad] = useState(4)
  const [loading, setLoading] = useState(true)
  const [subiendo, setSubiendo] = useState({}) // { [orden]: boolean }

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('carrusel_imagenes')
      .select('*')
      .order('orden', { ascending: true })

    if (!error && data) {
      const mapa = {}
      data.forEach((row) => { mapa[row.orden] = row.url })
      setImagenes(mapa)
      if (data.length > 0) setCantidad(Math.max(...data.map((d) => d.orden)))
    }
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const subirFoto = async (orden, file) => {
    if (!file) return
    setSubiendo({ ...subiendo, [orden]: true })
    try {
      const url = await subirImagen(file, 'carrusel')
      const { error } = await supabase
        .from('carrusel_imagenes')
        .upsert({ orden, url }, { onConflict: 'orden' })
      if (error) throw error
      setImagenes({ ...imagenes, [orden]: url })
    } catch (err) {
      alert('Error al subir la imagen: ' + err.message)
    } finally {
      setSubiendo({ ...subiendo, [orden]: false })
    }
  }

  const eliminarFoto = async (orden) => {
    if (!confirm(`¿Quitar la foto #${orden} del carrusel?`)) return
    const { error } = await supabase.from('carrusel_imagenes').delete().eq('orden', orden)
    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }
    const copia = { ...imagenes }
    delete copia[orden]
    setImagenes(copia)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-institutional-800 mb-2">Fotos del carrusel de portada</h2>
      <p className="text-sm text-institutional-600 mb-6">
        Estas son las imágenes que rotan en el inicio del sitio. Mientras no cargues fotos propias, se muestran imágenes de referencia genéricas.
      </p>

      {/* Recomendaciones */}
      <div className="bg-institutional-50 border border-institutional-100 rounded-xl p-5 mb-6 flex gap-3">
        <Info size={18} className="text-institutional-600 shrink-0 mt-0.5" />
        <div className="text-sm text-institutional-700 space-y-1">
          <p className="font-medium text-institutional-800">Características recomendadas para cada foto:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Formato JPG o PNG</li>
            <li>Orientación horizontal (apaisada)</li>
            <li>Resolución mínima sugerida: 1600 × 900 px</li>
            <li>Peso máximo sugerido: 2 MB, para que cargue rápido</li>
            <li>Evitar fotos con texto ya incrustado (el título del sitio se superpone encima)</li>
          </ul>
        </div>
      </div>

      {/* Selector de cantidad */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-institutional-700 mb-1.5">
          Cantidad de fotos en el carrusel
        </label>
        <select
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="w-full sm:w-64 rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? 'foto' : 'fotos'}</option>
          ))}
        </select>
        <p className="text-xs text-institutional-500 mt-1">
          Si reducís la cantidad, las fotos que queden "de más" simplemente dejan de rotar en el sitio — no se borran hasta que las elimines a mano.
        </p>
      </div>

      {loading ? (
        <p className="text-institutional-700">Cargando…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: cantidad }, (_, i) => i + 1).map((orden) => (
            <SlotFoto
              key={orden}
              orden={orden}
              url={imagenes[orden]}
              subiendo={!!subiendo[orden]}
              onSubir={(file) => subirFoto(orden, file)}
              onEliminar={() => eliminarFoto(orden)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SlotFoto({ orden, url, subiendo, onSubir, onEliminar }) {
  return (
    <div className="bg-white border border-institutional-100 rounded-xl overflow-hidden">
      <div className="aspect-video bg-institutional-50 flex items-center justify-center relative">
        {url ? (
          <img src={url} alt={`Foto ${orden} del carrusel`} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={28} className="text-institutional-100" />
        )}
        {subiendo && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 size={22} className="text-white animate-spin" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-institutional-800 mb-3">Foto #{orden}</p>
        <div className="flex gap-2">
          <label className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium bg-institutional-600 hover:bg-institutional-700 text-white px-3 py-2 rounded-lg cursor-pointer transition-colors">
            <Upload size={14} />
            {url ? 'Reemplazar' : 'Subir'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files[0] && onSubir(e.target.files[0])}
            />
          </label>
          {url && (
            <button
              onClick={onEliminar}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100"
              aria-label={`Eliminar foto ${orden}`}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
