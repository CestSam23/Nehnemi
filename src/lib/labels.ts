import type {
  DimensionIndicador,
  NivelConfianza,
  RolGobierno,
} from '@/api/types'

export const ROL_LABELS: Record<RolGobierno, string> = {
  ANALISTA: 'Analista',
  ADMINISTRADOR: 'Administrador',
}

export const DIMENSION_LABELS: Record<DimensionIndicador, string> = {
  ADOPCION: 'Adopción',
  INFRAESTRUCTURA: 'Infraestructura',
  PARTICIPACION: 'Participación',
  ACCESIBILIDAD: 'Condiciones de acceso',
}

export const CONFIANZA_LABELS: Record<NivelConfianza, string> = {
  BAJA: 'Confianza baja',
  MEDIA: 'Confianza media',
  ALTA: 'Confianza alta',
}
