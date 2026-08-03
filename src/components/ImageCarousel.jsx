import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ImageCarousel({ images, intervalMs = 6000, children }) {
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndice((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [images.length, intervalMs])

  const anterior = () => setIndice((i) => (i - 1 + images.length) % images.length)
  const siguiente = () => setIndice((i) => (i + 1) % images.length)

  return (
    <div className="relative h-[480px] sm:h-[560px] w-full overflow-hidden bg-signal-900">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === indice ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Degradado para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-signal-950/90 via-signal-950/50 to-signal-950/40" />

      {/* Contenido superpuesto */}
      <div className="relative h-full flex items-center justify-center px-5">
        {children}
      </div>

      {/* Controles */}
      <button
        onClick={anterior}
        aria-label="Imagen anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={siguiente}
        aria-label="Imagen siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndice(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === indice ? 'w-6 bg-pulse-400' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
