import React, { useEffect, useState } from 'react'
import { Search, Cpu, BookOpen, HandHeart, Mail, Phone, MapPin, Users, MapPinned, Layers } from 'lucide-react'
import WaveDivider from '../components/WaveDivider'
import ContactForm from '../components/ContactForm'
import ImageCarousel from '../components/ImageCarousel'
import { supabase } from '../supabaseClient'
import { AREAS } from '../lib/departamentos'
import { IMAGENES_HERO } from '../lib/imagenesHero'

const ejes = [
  {
    icon: Search,
    titulo: 'Investigación',
    texto: 'Nuestros integrantes están en un proceso constante de desarrollo y aprendizaje.',
  },
  {
    icon: Cpu,
    titulo: 'Tecnología',
    texto: 'Día a día aplicamos nuevas tecnologías y desarrollamos nuevas herramientas para llevar a cabo nuestro cometido.',
  },
  {
    icon: BookOpen,
    titulo: 'Esoterismo',
    texto: 'Guardamos el conocimiento de cientos de años atesorados por nuestros profesionales especialistas en esta área.',
  },
  {
    icon: HandHeart,
    titulo: 'Apoyo',
    texto: 'La ayuda brindada es de carácter honorario. Contenemos a las familias y brindamos soluciones integrales a sus problemas.',
  },
]

export default function Home() {
  const [stats, setStats] = useState({ grupos: null, departamentos: null })
  const [imagenesCarrusel, setImagenesCarrusel] = useState(IMAGENES_HERO)

  useEffect(() => {
    let activo = true
    supabase
      .from('agrupaciones')
      .select('departamento')
      .then(({ data, error }) => {
        if (!activo || error || !data) return
        const departamentos = new Set(data.map((g) => g.departamento))
        setStats({ grupos: data.length, departamentos: departamentos.size })
      })

    supabase
      .from('carrusel_imagenes')
      .select('url')
      .order('orden', { ascending: true })
      .then(({ data, error }) => {
        if (!activo) return
        if (!error && data && data.length > 0) {
          setImagenesCarrusel(data.map((row) => row.url))
        }
      })

    return () => { activo = false }
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative">
        <ImageCarousel images={imagenesCarrusel}>
          <div className="text-center text-white max-w-3xl">
            <h1 className="font-brand font-extrabold text-4xl sm:text-6xl tracking-wide text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
              AUDIP
            </h1>
            <p className="mt-3 font-serif text-lg sm:text-xl text-slate-200">
              Asociación Uruguaya de Investigación Paranormal
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="#contacto" className="btn-glow">Contactanos</a>
              <a href="#/mapa" className="inline-flex items-center gap-2 border border-white/40 hover:border-pulse-400 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                Ver equipos en el mapa
              </a>
            </div>
          </div>
        </ImageCarousel>

        {/* Franja de estadísticas */}
        <div className="relative bg-institutional-800">
          <div className="max-w-4xl mx-auto px-5 py-6 grid grid-cols-3 divide-x divide-white/10 text-center">
            <StatItem icon={Users} valor={stats.grupos} etiqueta="Grupos activos" />
            <StatItem icon={MapPinned} valor={stats.departamentos} etiqueta="Departamentos cubiertos" />
            <StatItem icon={Layers} valor={AREAS.length} etiqueta="Áreas de investigación" />
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section>
        <div className="max-w-4xl mx-auto px-5 py-16">
          <div className="card-surface p-6 sm:p-10">
            <p className="eyebrow mb-3">¿Quiénes somos?</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-5">
              Ciencia, técnica y contención al servicio de quienes nos necesitan
            </h2>
            <p className="text-slate-300 leading-relaxed text-[1.05rem]">
              Somos una asociación sin fines de lucro, formada por profesionales,
              técnicos e investigadores paranormales, abocada a la documentación
              y estudio objetivo de fenómenos paranormales. Nuestra misión
              principal es la ayuda a las familias que sufren de estos
              fenómenos y no encuentran una solución.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 pb-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ejes.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="card-surface p-6">
              <div className="h-11 w-11 rounded-xl bg-signal-700/50 flex items-center justify-center mb-4">
                <Icon size={20} className="text-pulse-400" />
              </div>
              <h3 className="font-serif font-semibold text-white mb-2">{titulo}</h3>
              <p className="text-sm text-slate-300/80 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <WaveDivider tone="dark" />

      {/* CONTACTO */}
      <section id="contacto">
        <div className="max-w-6xl mx-auto px-5 py-16 grid lg:grid-cols-2 gap-12">
          <div className="card-surface p-6 sm:p-10">
            <p className="eyebrow mb-3">Contacto</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
              ¿Alguna pregunta?
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              Envianos un mensaje para obtener más información, reportar un
              fenómeno o solicitar el apoyo de uno de nuestros equipos.
            </p>
            <ul className="space-y-3 text-white">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-pulse-400" />
                <a href="mailto:audipuruguay@gmail.com" className="hover:underline">audipuruguay@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-pulse-400" />
                <a href="tel:+59894724347" className="hover:underline">+598 94 724 347</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-pulse-400" />
                Montevideo, Uruguay
              </li>
            </ul>
          </div>

          <div className="card-surface p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

function StatItem({ icon: Icon, valor, etiqueta }) {
  return (
    <div className="px-2">
      <Icon size={18} className="mx-auto mb-2 text-pulse-400" />
      <p className="font-brand text-2xl sm:text-3xl font-bold text-white">
        {valor === null ? '—' : valor}
      </p>
      <p className="text-xs text-slate-400 mt-1">{etiqueta}</p>
    </div>
  )
}
