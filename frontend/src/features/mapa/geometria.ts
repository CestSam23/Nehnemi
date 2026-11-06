import type { ZonaMapaFeature } from '@/api/types'

export type Limites = [number, number, number, number]

function recorrer(
  coordenadas: unknown,
  visitar: (x: number, y: number) => void,
) {
  if (!Array.isArray(coordenadas)) return
  if (typeof coordenadas[0] === 'number') {
    visitar(coordenadas[0], coordenadas[1] as number)
    return
  }
  for (const interior of coordenadas) recorrer(interior, visitar)
}

export function limitesDe(features: ZonaMapaFeature[]): Limites | null {
  let oeste = Infinity
  let sur = Infinity
  let este = -Infinity
  let norte = -Infinity
  for (const feature of features) {
    recorrer(feature.geometry.coordinates, (x, y) => {
      if (x < oeste) oeste = x
      if (x > este) este = x
      if (y < sur) sur = y
      if (y > norte) norte = y
    })
  }
  if (!Number.isFinite(oeste)) return null
  return [oeste, sur, este, norte]
}
