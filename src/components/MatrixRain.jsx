import React, { useEffect, useRef } from 'react'

// Fondo global de "lluvia de código" estilo Matrix, en tono azul flúor
// acorde a la identidad de AUDIP. Vive fijo detrás de todo el contenido
// (ver App.jsx) — las secciones de cada página usan fondos oscuros
// semitransparentes (sin desenfoque, para no ensuciar el efecto) para
// dejarlo entrever sin sacrificar la lectura del texto.
export default function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const caracteres = 'アイウエオカキクケコサシスセソ0123456789'
    const palabras = [
      'PARANORMAL', 'DEMONIOS', 'MAGIA', 'HECHICERIA', 'INVESTIGACION',
      'OVNI', 'UAP', 'RITUAL', 'FANTASMAS', 'AUDIP', 'ESPIRITU', 'PORTAL',
    ]
    const tamañoFuente = 20
    let dpr = 1
    let anchoCss = 0
    let altoCss = 0
    let columnas = 0
    let gotas = []
    let frameId

    function dimensionar() {
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
      anchoCss = window.innerWidth
      altoCss = window.innerHeight

      // Backing store a resolución real del dispositivo (evita el desenfoque
      // que se ve en celulares de pantalla de alta densidad).
      canvas.width = anchoCss * dpr
      canvas.height = altoCss * dpr
      canvas.style.width = anchoCss + 'px'
      canvas.style.height = altoCss + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      columnas = Math.floor(anchoCss / tamañoFuente)
      gotas = new Array(columnas).fill(0).map(() => ({
        y: Math.random() * -40,
        palabra: null,
        indice: 0,
      }))
    }

    function dibujar() {
      // Estela: pintamos un rectángulo oscuro semi-opaco encima del cuadro
      // anterior en vez de limpiar del todo, para que el rastro se desvanezca.
      ctx.fillStyle = 'rgba(4, 7, 14, 0.22)'
      ctx.fillRect(0, 0, anchoCss, altoCss)

      ctx.font = `700 ${tamañoFuente}px "IBM Plex Mono", monospace`
      ctx.textBaseline = 'top'

      for (let i = 0; i < gotas.length; i++) {
        const gota = gotas[i]
        let char

        if (gota.palabra) {
          char = gota.palabra[gota.indice] ?? ' '
          gota.indice++
          if (gota.indice >= gota.palabra.length) gota.palabra = null
        } else {
          char = caracteres[Math.floor(Math.random() * caracteres.length)]
        }

        const x = i * tamañoFuente
        const y = gota.y * tamañoFuente

        const esLider = Math.random() > 0.94

        // Resplandor sutil para que el trazo se lea nítido y "neón"
        ctx.shadowColor = '#3ED6EE'
        ctx.shadowBlur = esLider ? 10 : 4
        ctx.fillStyle = esLider ? '#F4FEFF' : '#4FE0F5'
        ctx.globalAlpha = esLider ? 1 : 0.9
        ctx.fillText(char, x, y)

        if (y > altoCss && Math.random() > 0.975) {
          gota.y = 0
          gota.palabra = Math.random() > 0.7 ? palabras[Math.floor(Math.random() * palabras.length)] : null
          gota.indice = 0
        }
        gota.y++
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
