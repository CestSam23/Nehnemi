const enteros = new Intl.NumberFormat('es-MX')

export function formatearEntero(valor: number) {
  return enteros.format(valor)
}

const puntuaciones = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatearPuntuacion(valor: number) {
  return puntuaciones.format(valor)
}

export function formatearMetros(valor: number) {
  return `${enteros.format(Math.round(valor))} m`
}

const kilowatts = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatearKw(valor: number) {
  return `${kilowatts.format(valor)} kW`
}

const periodos = new Intl.DateTimeFormat('es-MX', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatearPeriodo(periodo: string) {
  const fecha = new Date(`${periodo}-01T00:00:00Z`)
  if (Number.isNaN(fecha.getTime())) return periodo
  return periodos.format(fecha).replace('.', '')
}

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

const fechas = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

export function formatearFecha(valor: string | null) {
  if (!valor) return '—'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  return fechas.format(fecha)
}
