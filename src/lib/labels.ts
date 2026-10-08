import type {
  AccionRecomendada,
  DimensionIndicador,
  EstadoSolicitud,
  NivelConfianza,
  PrioridadRecomendacion,
  RolGobierno,
  TipoBarreraDiagnosticada,
  TipoZona,
} from '@/api/types'

export const ACCION_LABELS: Record<AccionRecomendada, string> = {
  RECOPILAR_MAS_DATOS: 'Recopilar más datos',
  EVALUAR_EXPANSION_CARGA: 'Evaluar expansión de carga',
  AUMENTAR_PARTICIPACION: 'Aumentar participación',
  EVALUAR_ACCESIBILIDAD_ECONOMICA: 'Evaluar accesibilidad económica',
  INTERVENCION_INFORMATIVA: 'Intervención informativa',
  MONITOREAR: 'Monitorear',
  INVESTIGAR: 'Investigar',
}

export const BARRERA_LABELS: Record<TipoBarreraDiagnosticada, string> = {
  INFRAESTRUCTURA: 'Infraestructura',
  PARTICIPACION: 'Participación',
  ACCESIBILIDAD_ECONOMICA: 'Accesibilidad económica',
  INFORMACION: 'Información',
  EVIDENCIA_INSUFICIENTE: 'Evidencia insuficiente',
  SIN_CUELLO_PRIORITARIO: 'Sin cuello prioritario',
}

export const PRIORIDAD_LABELS: Record<PrioridadRecomendacion, string> = {
  BAJA: 'Prioridad baja',
  MEDIA: 'Prioridad media',
  ALTA: 'Prioridad alta',
}

export const ESTADO_SOLICITUD_LABELS: Record<EstadoSolicitud, string> = {
  REGISTRADA: 'Registradas',
  EN_REVISION: 'En revisión',
  ATENDIDA: 'Atendidas',
  DESCARTADA: 'Descartadas',
}

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

export const TIPO_ZONA_LABELS: Record<TipoZona, string> = {
  CDMX: 'Ciudad de México',
  ALCALDIA: 'Alcaldía',
  AGEB: 'Clave geoestadística urbana',
}

export const CONFIANZA_LABELS: Record<NivelConfianza, string> = {
  BAJA: 'Confianza baja',
  MEDIA: 'Confianza media',
  ALTA: 'Confianza alta',
}
