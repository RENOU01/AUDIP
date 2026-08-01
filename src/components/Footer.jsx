import React from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-signal-900 border-t border-signal-700 text-slate-400">
      <div className="max-w-6xl mx-auto px-5 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <img src={`${import.meta.env.BASE_URL}logo-audip.jpg`} alt="AUDIP" className="h-10 w-auto mb-3" />
          <p className="text-sm leading-relaxed text-slate-400">
            Asociación Uruguaya de Investigación Paranormal. Documentación y
            estudio objetivo de fenómenos paranormales en todo el territorio
            nacional.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Contacto</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-pulse-500 shrink-0" />
              <a href="mailto:audipuruguay@gmail.com" className="hover:text-white transition-colors">
                audipuruguay@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-pulse-500 shrink-0" />
              <a href="tel:+59894724347" className="hover:text-white transition-colors">
                +598 94 724 347
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-pulse-500 shrink-0" />
              Montevideo, Uruguay
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Institucional</p>
          <p className="text-sm leading-relaxed">
            Asociación sin fines de lucro. La ayuda brindada a las familias es
            de carácter honorario.
          </p>
        </div>
      </div>
      <div className="border-t border-signal-700 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} AUDIP — Asociación Uruguaya de Investigación Paranormal
      </div>
    </footer>
  )
}
