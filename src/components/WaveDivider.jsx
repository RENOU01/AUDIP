import React, { useEffect, useRef, useState } from 'react'

// Divisor de sección con el trazo de "señal" del logo de AUDIP.
// Se dibuja una sola vez cuando entra en pantalla (respeta prefers-reduced-motion vía CSS global).
export default function WaveDivider({ tone = 'dark', className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const stroke = tone === 'dark' ? '#3ED6EE' : '#1B3A6B'

  return (
    <div ref={ref} className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 60" width="100%" height="40" preserveAspectRatio="none">
        <path
          className={visible ? 'waveform-path' : ''}
          d="M0,30 L140,30 L165,10 L185,50 L205,30 L340,30 L365,5 L385,55 L410,30 L560,30 L582,20 L600,40 L620,30 L760,30 L785,8 L805,52 L825,30 L980,30 L1000,18 L1020,42 L1040,30 L1200,30"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={!visible ? { strokeDasharray: 1400, strokeDashoffset: 1400 } : undefined}
        />
      </svg>
    </div>
  )
}
