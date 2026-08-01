import { supabase } from '../supabaseClient'

// Sube un archivo al bucket público "audip-media" y devuelve su URL pública.
// carpeta separa los archivos por tipo dentro del mismo bucket (logos, fotos, etc).
export async function subirImagen(file, carpeta) {
  if (!file) return null

  const extension = file.name.split('.').pop()
  const nombreArchivo = `${carpeta}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from('audip-media')
    .upload(nombreArchivo, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('audip-media').getPublicUrl(nombreArchivo)
  return data.publicUrl
}
