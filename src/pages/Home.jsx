import React from 'react'
import { Search, Cpu, BookOpen, HandHeart, Mail, Phone, MapPin } from 'lucide-react'
import WaveDivider from '../components/WaveDivider'
import ContactForm from '../components/ContactForm'

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
  return (
    <div>
      {/* HERO */}
      <section className="relative bg-signal-900 bg-grid-faint bg-grid hero-glow text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 pt-28 pb-24 text-center">
          <p className="eyebrow mb-6">Uruguay · Investigación paranormal</p>

          <h1 className="font-brand font-extrabold text-5xl sm:text-7xl tracking-wide bg-gradient-to-b from-white via-pulse-400 to-pulse-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(62,214,238,0.35)]">
            AUDIP
          </h1>
          <p className="mt-4 font-serif text-lg sm:text-xl text-slate-300">
            Asociación Uruguaya de Investigación Paranormal
          </p>

          <p className="mt-8 text-slate-300 max-w-xl mx-auto leading-relaxed text-lg">
            Documentación y estudio objetivo de fenómenos paranormales en todo
            el territorio nacional.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#contacto" className="btn-glow">Contactanos</a>
            <a href="#/mapa" className="inline-flex items-center gap-2 border border-white/20 hover:border-pulse-500/60 text-white font-medium px-6 py-3 rounded-xl transition-colors">
              Ver equipos en el mapa
            </a>
          </div>
        </div>
        <WaveDivider tone="dark" />
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="bg-paper">
        <div className="max-w-4xl mx-auto px-5 py-16">
          <p className="eyebrow mb-3 text-institutional-600">¿Quiénes somos?</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-institutional-800 mb-5">
            Ciencia, técnica y contención al servicio de quienes nos necesitan
          </h2>
          <p className="text-institutional-700 leading-relaxed text-[1.05rem]">
            Somos una asociación sin fines de lucro, formada por profesionales,
            técnicos e investigadores paranormales, abocada a la documentación
            y estudio objetivo de fenómenos paranormales. Nuestra misión
            principal es la ayuda a las familias que sufren de estos
            fenómenos y no encuentran una solución.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-5 pb-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ejes.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="card-surface p-6">
              <div className="h-11 w-11 rounded-xl bg-institutional-50 flex items-center justify-center mb-4">
                <Icon size={20} className="text-institutional-600" />
              </div>
              <h3 className="font-serif font-semibold text-institutional-800 mb-2">{titulo}</h3>
              <p className="text-sm text-institutional-700/80 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <WaveDivider tone="light" className="bg-institutional-50" />

      {/* CONTACTO */}
      <section id="contacto" className="bg-institutional-50">
        <div className="max-w-6xl mx-auto px-5 py-16 grid lg:grid-cols-2 gap-12">
          <div>
            <p className="eyebrow mb-3 text-institutional-600">Contacto</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-institutional-800 mb-6">
              ¿Alguna pregunta?
            </h2>
            <p className="text-institutional-700 leading-relaxed mb-8">
              Envianos un mensaje para obtener más información, reportar un
              fenómeno o solicitar el apoyo de uno de nuestros equipos.
            </p>
            <ul className="space-y-3 text-institutional-800">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-institutional-600" />
                <a href="mailto:audipuruguay@gmail.com" className="hover:underline">audipuruguay@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-institutional-600" />
                <a href="tel:+59894724347" className="hover:underline">+598 94 724 347</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-institutional-600" />
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
