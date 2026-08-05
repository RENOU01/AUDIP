import React, { useEffect, useRef } from 'react'

// Fondo global de "lluvia de código" estilo Matrix, en azul eléctrico,
// con palabras temáticas de AUDIP cayendo en vez de caracteres sueltos.
// Vive fijo detrás de todo el contenido (ver App.jsx). Las secciones con
// texto de lectura son opacas a propósito para que nunca se mezclen con
// el efecto — el efecto se ve en los márgenes, encabezados y espacios
// entre secciones.
export default function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const palabras = [
      'PARANORMAL', 'DEMONIOS', 'MAGIA', 'HECHICERIA', 'INVESTIGACION',
      'OVNI', 'UAP', 'RITUAL', 'FANTASMAS', 'AUDIP', 'ESPIRITU', 'PORTAL',
      'URUGUAY', 'MISTERIO', 'PSIQUIS', 'ENTIDAD',
    ]
    const tamañoFuente = 20
    let dpr = 1
    let anchoCss = 0
    let altoCss = 0
    let columnas = 0
    let gotas = []
    let contadorFrame = 0

    function palabraAleatoria() {
      return palabras[Math.floor(Math.random() * palabras.length)]
    }

    function dimensionar() {
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
      anchoCss = window.innerWidth
      altoCss = window.innerHeight

      canvas.width = anchoCss * dpr
      canvas.height = altoCss * dpr
      canvas.style.width = anchoCss + 'px'
      canvas.style.height = altoCss + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      columnas = Math.floor(anchoCss / tamañoFuente)
      gotas = new Array(columnas).fill(0).map(() => ({
        y: Math.random() * -40,
        palabra: palabraAleatoria(),
        indice: 0,
        // cada columna cae a su propia velocidad (bastante más lenta)
        velocidad: 0.08 + Math.random() * 0.12,
      }))
    }

    let frameId

    function dibujar() {
      contadorFrame++

      ctx.fillStyle = 'rgba(4, 7, 14, 0.16)'
      ctx.fillRect(0, 0, anchoCss, altoCss)

      ctx.font = `700 ${tamañoFuente}px "IBM Plex Mono", monospace`
      ctx.textBaseline = 'top'

      for (let i = 0; i < gotas.length; i++) {
        const gota = gotas[i]
        const char = gota.palabra[gota.indice] ?? ' '

        const x = i * tamañoFuente
        const y = gota.y * tamañoFuente
        const esLider = gota.indice === 0

        // Azul eléctrico, más oscuro y saturado que un cian claro
        ctx.shadowColor = '#1D5FE0'
        ctx.shadowBlur = esLider ? 7 : 3
        ctx.fillStyle = esLider ? '#3E7BFF' : '#1D5FE0'
        ctx.globalAlpha = esLider ? 0.95 : 0.75
        ctx.fillText(char, x, y)

        // Avance de fila cada ciertos cuadros (según la velocidad de la
        // columna) — esto es lo que hace que la caída sea más lenta.
        if (contadorFrame % Math.round(1 / gota.velocidad) === 0) {
          gota.y++
          gota.indice++
          if (gota.indice >= gota.palabra.length) {
            // pequeño espacio en blanco entre una palabra y la siguiente
            if (gota.indice > gota.palabra.length + 2) {
              gota.indice = 0
              gota.palabra = palabraAleatoria()
            }
          }
        }

        if (y > altoCss + tamañoFuente) {
          gota.y = Math.random() * -20
          gota.indice = 0
          gota.palabra = palabraAleatoria()
        }
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      frameId = requestAnimationFrame(dibujar)
    }

    dimensionar()
    window.addEventListener('resize', dimensionar)

    if (!prefiereMenosMovimiento) {
      frameId = requestAnimationFrame(dibujar)
    } else {
      dibujar()
      cancelAnimationFrame(frameId)
    }

    return () => {
      window.removeEventListener('resize', dimensionar)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-signal-950"
      aria-hidden="true"
    />
  )
}
