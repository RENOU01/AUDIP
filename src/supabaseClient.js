import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Esto solo debería verse en desarrollo si falta el archivo .env
  console.error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env y completá tus datos de Supabase.'
  )
}

// Usamos ÚNICAMENTE la clave "anon" (pública) acá. Nunca la "service_role".
// La seguridad real la dan las políticas de Row Level Security (RLS)
// definidas en supabase/schema.sql — ver README.md, sección Seguridad.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
