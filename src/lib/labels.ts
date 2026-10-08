import type {
  AccionRecomendada,
  DimensionIndicador,
  EstadoSolicitud,
  MotivoSolicitud,
  NivelConfianza,
  PrioridadRecomendacion,
  TipoProcedencia,
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

export const ESTADO_SOLICITUD_LABEL: Record<EstadoSolicitud, string> = {
  REGISTRADA: 'Registrada',
  EN_REVISION: 'En revisión',
  ATENDIDA: 'Atendida',
  DESCARTADA: 'Descartada',
}

export const ESTADO_SOLICITUD_COLORS: Record<EstadoSolicitud, string> = {
  REGISTRADA: 'bg-info/15 text-info',
  EN_REVISION: 'bg-warning/15 text-foreground',
  ATENDIDA: 'bg-success/15 text-success',
  DESCARTADA: 'bg-muted text-muted-foreground',
}

export const MOTIVO_LABELS: Record<MotivoSolicitud, string> = {
  VIVO_CERCA: 'Vivo cerca',
  TRABAJO_CERCA: 'Trabajo cerca',
  TRANSITO_FRECUENTE: 'Tránsito frecuente',
  TENGO_EV: 'Tengo un vehículo eléctrico',
  CONSIDERARIA_EV_CON_CARGA: 'Consideraría un vehículo eléctrico con carga',
  OTRO: 'Otro',
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

export const PROCEDENCIA_LABELS: Record<TipoProcedencia, string> = {
  OFICIAL: 'Oficial',
  NEHNEMI: 'Nehnemi',
  SIMULADO: 'Simulado',
  DERIVADO: 'Derivado',
}
