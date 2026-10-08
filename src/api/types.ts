export type TipoZona = 'CDMX' | 'ALCALDIA' | 'AGEB'

export type TipoProcedencia = 'OFICIAL' | 'NEHNEMI' | 'SIMULADO' | 'DERIVADO'

export type TipoPropulsion =
  | 'ELECTRICO'
  | 'HIBRIDO_ENCHUFABLE'
  | 'HIBRIDO'
  | 'COMBUSTION'
  | 'OTRO'
  | 'SIN_AUTOMOVIL'

export type RespuestaConsideracion = 'SI' | 'NO' | 'NO_SE'

export type TipoBarreraDeclarada =
  | 'PRECIO'
  | 'CARGA'
  | 'AUTONOMIA'
  | 'INFORMACION_DUDAS'
  | 'CARACTERISTICAS_VEHICULO'
  | 'NO_INTERESA'
  | 'OTRA'
  | 'NINGUNA'

export type EstadoSolicitud =
  'REGISTRADA' | 'EN_REVISION' | 'ATENDIDA' | 'DESCARTADA'

export type DimensionIndicador =
  'ADOPCION' | 'INFRAESTRUCTURA' | 'PARTICIPACION' | 'ACCESIBILIDAD'

export type NivelIndicador = 'MUY_BAJA' | 'BAJA' | 'MEDIA' | 'ALTA'

export type NivelConfianza = 'BAJA' | 'MEDIA' | 'ALTA'

export type TipoBarreraDiagnosticada =
  | 'INFRAESTRUCTURA'
  | 'PARTICIPACION'
  | 'ACCESIBILIDAD_ECONOMICA'
  | 'INFORMACION'
  | 'EVIDENCIA_INSUFICIENTE'
  | 'SIN_CUELLO_PRIORITARIO'

export type AccionRecomendada =
  | 'RECOPILAR_MAS_DATOS'
  | 'EVALUAR_EXPANSION_CARGA'
  | 'AUMENTAR_PARTICIPACION'
  | 'EVALUAR_ACCESIBILIDAD_ECONOMICA'
  | 'INTERVENCION_INFORMATIVA'
  | 'MONITOREAR'
  | 'INVESTIGAR'

export type PrioridadRecomendacion = 'BAJA' | 'MEDIA' | 'ALTA'
