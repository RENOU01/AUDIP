// Los 19 departamentos de Uruguay con una coordenada de referencia
// (aprox. la capital departamental) usada para ubicar automáticamente
// a cada agrupación en el mapa según el departamento que elija el admin.
export const DEPARTAMENTOS = [
  { nombre: 'Artigas', lat: -30.4, lng: -56.47 },
  { nombre: 'Canelones', lat: -34.538, lng: -56.277 },
  { nombre: 'Cerro Largo', lat: -32.35, lng: -54.3 },
  { nombre: 'Colonia', lat: -34.15, lng: -57.6 },
  { nombre: 'Durazno', lat: -33.2, lng: -56.3 },
  { nombre: 'Flores', lat: -33.55, lng: -56.9 },
  { nombre: 'Florida', lat: -34.05, lng: -56.2 },
  { nombre: 'Lavalleja', lat: -34.1, lng: -55.0 },
  { nombre: 'Maldonado', lat: -34.6, lng: -54.8 },
  { nombre: 'Montevideo', lat: -34.85, lng: -56.15 },
  { nombre: 'Paysandú', lat: -32.1, lng: -57.5 },
  { nombre: 'Río Negro', lat: -32.8, lng: -57.9 },
  { nombre: 'Rivera', lat: -30.9, lng: -55.6 },
  { nombre: 'Rocha', lat: -34.1, lng: -54.1 },
  { nombre: 'Salto', lat: -31.5, lng: -57.7 },
  { nombre: 'San José', lat: -34.4, lng: -56.6 },
  { nombre: 'Soriano', lat: -33.4, lng: -58.1 },
  { nombre: 'Tacuarembó', lat: -31.9, lng: -55.9 },
  { nombre: 'Treinta y Tres', lat: -33.2, lng: -54.4 },
]

export function coordsDeDepartamento(nombre) {
  const d = DEPARTAMENTOS.find((d) => d.nombre === nombre)
  return d ? { lat: d.lat, lng: d.lng } : null
}

export const AREAS = [
  { valor: 'paranormal', etiqueta: 'Paranormal', color: '#3ED6EE' },
  { valor: 'ufologia', etiqueta: 'Ufología', color: '#A78BFA' },
  { valor: 'holistica', etiqueta: 'Holística', color: '#F4A15D' },
]
