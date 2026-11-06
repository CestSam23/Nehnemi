import type {
  DimensionIndicador,
  NivelConfianza,
  NivelIndicador,
} from '@/api/types'

export const FORMULAS: Record<
  DimensionIndicador,
  { formula: string; nota: string }
> = {
  INFRAESTRUCTURA: {
    formula: '0.5 × cobertura + 0.5 × capacidad',
    nota: 'La cobertura se mide por la distancia a la estación más cercana desde el centroide de la AGEB; la capacidad, por conectores por cada 1,000 viviendas con automóvil.',
  },
  ACCESIBILIDAD: {
    formula: '0.5 × IDS + 0.5 × tenencia de automóvil',
    nota: 'No representa la capacidad adquisitiva individual ni el precio de un vehículo eléctrico.',
  },
  PARTICIPACION: {
    formula: '0.5 × cobertura Nehnemi + 0.5 × actividad',
    nota: 'Depende de datos ciudadanos: sin participantes suficientes no hay evidencia suficiente.',
  },
  ADOPCION: {
    formula: 'Percentil de participantes con EV ÷ participantes con automóvil',
    nota: 'Depende de datos ciudadanos: requiere al menos 30 participantes con automóvil.',
  },
}

export const UMBRALES_NIVEL: { nivel: NivelIndicador; rango: string }[] = [
  { nivel: 'MUY_BAJA', rango: 'Menor a 25' },
  { nivel: 'BAJA', rango: 'De 25 a menos de 50' },
  { nivel: 'MEDIA', rango: 'De 50 a menos de 75' },
  { nivel: 'ALTA', rango: '75 o más' },
]

export const UMBRALES_CONFIANZA: { nivel: NivelConfianza; rango: string }[] = [
  { nivel: 'BAJA', rango: 'Menos de 30 participantes' },
  { nivel: 'MEDIA', rango: 'De 30 a menos de 100 participantes' },
  { nivel: 'ALTA', rango: '100 participantes o más' },
]
