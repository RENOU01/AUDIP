import React, { useEffect, useRef } from 'react'

// Fondo global de "lluvia de código" estilo Matrix, en tono azul flúor
// acorde a la identidad de AUDIP. Vive fijo detrás de todo el contenido
// (ver App.jsx) — las secciones de cada página usan fondos semitransparentes
// para dejarlo entrever sin sacrificar la lectura del texto.
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
    const tamañoFuente = 16
    let columnas = 0
    let gotas = []
    let frameId

    function dimensionar() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      columnas = Math.floor(canvas.width / tamañoFuente)
      gotas = new Array(columnas).fill(0).map(() => ({
        y: Math.random() * -100,
        palabra: null,
        indice: 0,
      }))
    }

    function dibujar() {
      // Estela: en vez de limpiar, pintamos un rectángulo casi opaco encima
      ctx.fillStyle = 'rgba(5, 8, 16, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${tamañoFuente}px monospace`

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

        // Carácter líder más brillante (blanco-celeste), resto en azul flúor
        ctx.fillStyle = Math.random() > 0.95 ? '#EAFDFF' : '#3ED6EE'
        ctx.globalAlpha = Math.random() * 0.5 + 0.4
        ctx.fillText(char, x, y)
        ctx.globalAlpha = 1

        if (y > canvas.height && Math.random() > 0.975) {
          gota.y = 0
          gota.palabra = Math.random() > 0.7 ? palabras[Math.floor(Math.random() * palabras.length)] : null
          gota.indice = 0
        }
        gota.y++
      }

      frameId = requestAnimationFrame(dibujar)
    }

    dimensionar()
    window.addEventListener('resize', dimensionar)

    if (!prefiereMenosMovimiento) {
      frameId = requestAnimationFrame(dibujar)
    } else {
      // Si el usuario prefiere menos movimiento, dibujamos un solo cuadro estático
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
      className="fixed inset-0 -z-10 h-screen w-screen bg-signal-950"
      aria-hidden="true"
    />
  )
}
