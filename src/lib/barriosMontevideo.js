// Barrios más conocidos de Montevideo con coordenadas aproximadas (centro del
// barrio). No es la lista oficial completa de 62 barrios del INE/IM —cubre
// los más comunes y poblados—, así que si el barrio de un grupo no aparece
// acá, el admin puede escribirlo igual como texto libre y ajustar la
// ubicación exacta con los campos de Latitud/Longitud (GPS) del formulario.
export const BARRIOS_MONTEVIDEO = [
  { nombre: 'Ciudad Vieja', lat: -34.9075, lng: -56.2019 },
  { nombre: 'Centro', lat: -34.9036, lng: -56.1883 },
  { nombre: 'Barrio Sur', lat: -34.9095, lng: -56.1968 },
  { nombre: 'Palermo', lat: -34.9126, lng: -56.1904 },
  { nombre: 'Cordón', lat: -34.9070, lng: -56.1809 },
  { nombre: 'Parque Rodó', lat: -34.9155, lng: -56.1665 },
  { nombre: 'Punta Carretas', lat: -34.9203, lng: -56.1587 },
  { nombre: 'Pocitos', lat: -34.9122, lng: -56.1548 },
  { nombre: 'Buceo', lat: -34.9059, lng: -56.1367 },
  { nombre: 'Malvín', lat: -34.8967, lng: -56.1224 },
  { nombre: 'Malvín Norte', lat: -34.8804, lng: -56.1349 },
  { nombre: 'Carrasco', lat: -34.8877, lng: -56.0611 },
  { nombre: 'Punta Gorda', lat: -34.8944, lng: -56.1050 },
  { nombre: 'Tres Cruces', lat: -34.8945, lng: -56.1668 },
  { nombre: 'La Blanqueada', lat: -34.8917, lng: -56.1611 },
  { nombre: 'Parque Batlle', lat: -34.8974, lng: -56.1524 },
  { nombre: 'Aguada', lat: -34.8969, lng: -56.1928 },
  { nombre: 'Reducto', lat: -34.8877, lng: -56.1975 },
  { nombre: 'Villa Muñoz', lat: -34.8967, lng: -56.1817 },
  { nombre: 'La Comercial', lat: -34.8917, lng: -56.1789 },
  { nombre: 'Jacinto Vera', lat: -34.8886, lng: -56.1839 },
  { nombre: 'Larrañaga', lat: -34.8811, lng: -56.1667 },
  { nombre: 'Brazo Oriental', lat: -34.8814, lng: -56.1806 },
  { nombre: 'Prado', lat: -34.8686, lng: -56.2005 },
  { nombre: 'Capurro', lat: -34.8892, lng: -56.2205 },
  { nombre: 'Bella Vista', lat: -34.8811, lng: -56.2103 },
  { nombre: 'Belvedere', lat: -34.8722, lng: -56.2189 },
  { nombre: 'Nuevo París', lat: -34.8497, lng: -56.2244 },
  { nombre: 'Cerro', lat: -34.9033, lng: -56.2661 },
  { nombre: 'Casabó', lat: -34.8858, lng: -56.3092 },
  { nombre: 'Colón', lat: -34.8044, lng: -56.2294 },
  { nombre: 'Lezica', lat: -34.8386, lng: -56.2317 },
  { nombre: 'Melilla', lat: -34.7767, lng: -56.3011 },
  { nombre: 'Sayago', lat: -34.8383, lng: -56.2069 },
  { nombre: 'Peñarol', lat: -34.8367, lng: -56.1875 },
  { nombre: 'Piedras Blancas', lat: -34.8228, lng: -56.1600 },
  { nombre: 'Manga', lat: -34.8156, lng: -56.1264 },
  { nombre: 'Toledo', lat: -34.7644, lng: -56.1067 },
  { nombre: 'Casavalle', lat: -34.8294, lng: -56.1692 },
  { nombre: 'Marconi', lat: -34.8367, lng: -56.1439 },
  { nombre: 'Cerrito de la Victoria', lat: -34.8656, lng: -56.1706 },
  { nombre: 'La Figurita', lat: -34.8794, lng: -56.1875 },
  { nombre: 'Maroñas', lat: -34.8544, lng: -56.1372 },
  { nombre: 'Flor de Maroñas', lat: -34.8422, lng: -56.1319 },
  { nombre: 'Villa Española', lat: -34.8531, lng: -56.1494 },
  { nombre: 'Ituzaingó', lat: -34.8461, lng: -56.1517 },
  { nombre: 'Punta de Rieles', lat: -34.8483, lng: -56.1103 },
]

export function coordsDeBarrioMontevideo(nombre) {
  const b = BARRIOS_MONTEVIDEO.find(
    (b) => b.nombre.toLowerCase() === (nombre || '').trim().toLowerCase()
  )
  return b ? { lat: b.lat, lng: b.lng } : null
}
