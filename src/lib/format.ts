export function iniciales(nombre: string) {
  const palabras = nombre
    .trim()
    .split(/\s+/)
    .filter((palabra) => palabra && !palabra.endsWith('.'))
  const fuente = palabras.length > 0 ? palabras : nombre.trim().split(/\s+/)
  const primera = fuente[0]?.[0]
  if (!primera) return '?'
  const ultima = fuente.length > 1 ? fuente[fuente.length - 1][0] : ''
  return `${primera}${ultima}`.toUpperCase()
}
