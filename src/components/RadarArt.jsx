import React from 'react'

// Ilustración de radar/escaneo — refuerza la identidad de "investigación y
// detección de señales" sin depender de fotografías. Puramente decorativa.
export default function RadarArt() {
  return (
    <svg
      viewBox="0 0 800 800"
      className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none select-none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="radarFade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3ED6EE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3ED6EE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="#3ED6EE" strokeOpacity="0.25" fill="none">
        <circle cx="400" cy="400" r="120" />
        <circle cx="400" cy="400" r="220" />
        <circle cx="400" cy="400" r="320" />
      </g>
      <line x1="400" y1="80" x2="400" y2="720" stroke="#3ED6EE" strokeOpacity="0.12" />
      <line x1="80" y1="400" x2="720" y2="400" stroke="#3ED6EE" strokeOpacity="0.12" />
      <path className="radar-sweep" d="M400,400 L400,80 A320,320 0 0,1 626,174 Z" fill="url(#radarFade)" />
      {/* Puntos de "detección" */}
      <circle cx="520" cy="280" r="4" fill="#3ED6EE" fillOpacity="0.7" />
      <circle cx="300" cy="500" r="3" fill="#A78BFA" fillOpacity="0.6" />
      <circle cx="560" cy="470" r="3" fill="#3ED6EE" fillOpacity="0.5" />
      <circle cx="260" cy="260" r="2.5" fill="#3ED6EE" fillOpacity="0.5" />
    </svg>
  )
}
