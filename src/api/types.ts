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

export type MotivoSolicitud =
  | 'VIVO_CERCA'
  | 'TRABAJO_CERCA'
  | 'TRANSITO_FRECUENTE'
  | 'TENGO_EV'
  | 'CONSIDERARIA_EV_CON_CARGA'
  | 'OTRO'

export type RolGobierno = 'ANALISTA' | 'ADMINISTRADOR'

export type UsuarioGobierno = {
  id: string
  nombre: string
  correo: string
  rol: RolGobierno
}

export type IniciarSesionBody = {
  correo: string
  contrasena: string
}

export type IniciarSesionRespuesta = UsuarioGobierno

export type SesionRespuesta = UsuarioGobierno

export type DimensionDisponibilidad = {
  disponible: boolean
  motivo?: string
}

export type DistribucionDimension = {
  disponibles: number
  sin_datos: number
  niveles: Record<NivelIndicador, number>
}

export type PuntoVentasEv = {
  periodo: string
  vehiculos: number
  unidad: string
  fuente: string
}

export type VentasEv = {
  ambito: string
  ultimo_periodo: string
  ultimo_valor: number
  periodos_disponibles: number
  serie_mensual?: PuntoVentasEv[]
}

export type ZonaPrioritaria = {
  clave_zona: string
  nombre_zona: string
  recomendacion_id: number
  barrera_principal: TipoBarreraDiagnosticada
  accion: AccionRecomendada
  prioridad: PrioridadRecomendacion
  confianza: NivelConfianza
  creado_en: string
}

export type RecomendacionZona = {
  id: number
  barrera_principal: TipoBarreraDiagnosticada
  accion: AccionRecomendada
  prioridad: PrioridadRecomendacion
  confianza: NivelConfianza
  razones: string[]
  evidencia: Record<string, string | number | boolean | null>
  version_reglas: string
  creado_en: string
}

export type RecomendacionesZonaRespuesta = {
  zona_clave: string
  recomendaciones: RecomendacionZona[]
}

export type PanoramaRespuesta = {
  fecha_actualizacion: string
  cobertura_territorial: {
    alcaldias: number
    agebs: number
  }
  infraestructura: {
    estaciones_registradas: number
    conectores_registrados: number
    potencia_total_kw: number
    potencia_nominal_agregada_kw?: number
    estado_operativo_verificado: boolean
  }
  participacion: {
    ciudadanos_registrados: number
    solicitudes_registradas: number
  }
  solicitudes: {
    total: number
    por_estado: Record<EstadoSolicitud, number>
  }
  distribuciones: Record<DimensionIndicador, DistribucionDimension>
  ventas_ev: VentasEv
  zonas_prioritarias: ZonaPrioritaria[]
  fuentes_documentadas: number
  dimensiones: Record<DimensionIndicador, DimensionDisponibilidad>
}

export type ZonaListado = {
  clave: string
  tipo: TipoZona
  nombre: string
  zona_padre_clave: string | null
}

export type ZonaDetalle = ZonaListado & {
  activa: boolean
}

export type ComponentesIndicador = Record<string, number | null>

export type Indicador = {
  dimension: DimensionIndicador
  disponible: boolean
  puntuacion: number | null
  nivel: NivelIndicador | null
  confianza: NivelConfianza | null
  tamano_muestra: number | null
  componentes: ComponentesIndicador | null
  explicacion: string | null
}

export type IndicadoresRespuesta = {
  zona_clave: string
  indicadores: Indicador[]
}

export type ZonaMapaGeometry =
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }

export type ZonaMapaProperties = {
  clave: string
  tipo: TipoZona
  nombre: string
  dimension: DimensionIndicador
  disponible: boolean
  puntuacion: number | null
  nivel: NivelIndicador | null
  confianza: NivelConfianza | null
}

export type ZonaMapaFeature = {
  type: 'Feature'
  geometry: ZonaMapaGeometry
  properties: ZonaMapaProperties
}

export type ZonasMapaRespuesta = {
  type: 'FeatureCollection'
  features: ZonaMapaFeature[]
}

export type ZonasMapaParams = {
  tipo: Exclude<TipoZona, 'CDMX'>
  dimension: DimensionIndicador
}

export type InfraestructuraZona = {
  estaciones: number
  conectores: number
  potencia_total_kw: number
  distancia_estacion_m: number | null
}

export type ResumenZonaRespuesta = ZonaListado & {
  indicadores: Indicador[]
  infraestructura: InfraestructuraZona | null
}

export type Senal = {
  codigo: string
  categoria: string
  valor: number | string | null
  unidad: string | null
  descripcion: string | null
}

export type SenalesRespuesta = {
  zona_clave: string
  senales: Senal[]
}

export type ConteoPorValor<T extends string> = {
  valor: T
  cantidad: number
}

export type SolicitudesZonaRespuesta = {
  zona_clave: string
  total: number
  por_estado: ConteoPorValor<EstadoSolicitud>[]
  por_motivo: ConteoPorValor<MotivoSolicitud>[]
}

export type SolicitudInfraestructura = {
  id: string
  zona_clave: string
  motivo: MotivoSolicitud
  comentario: string | null
  estado: EstadoSolicitud
  creado_en: string
}

export type SolicitudesListadoRespuesta = {
  total: number
  pagina: number
  limite: number
  solicitudes: SolicitudInfraestructura[]
}

export type ActualizarSolicitudBody = {
  estado: EstadoSolicitud
}

export type SolicitudesParams = {
  pagina: number
  limite: number
  estado?: EstadoSolicitud
  clave_zona?: string
}

export type FuenteDatos = {
  id: string
  clave: string
  nombre: string
  tipo_procedencia: TipoProcedencia
  referencia: string | null
  fecha_referencia: string | null
  fecha_descarga: string | null
  notas: string | null
}

export type Ubicacion = {
  latitud: number
  longitud: number
}

export type ConectorEstacionListado = {
  cantidad: number
  tipo_conector: string | null
  potencia_kw: number | null
  estado_operativo: string | null
}

export type EstacionCargaListado = {
  id: string
  identificador: string | null
  nombre: string
  direccion: string | null
  ubicacion: Ubicacion
  estado_demostracion: string | null
  conectores: ConectorEstacionListado[]
}

export type ConectorEstacionDetalle = ConectorEstacionListado

export type EstacionCargaDetalle = {
  id: string
  nombre: string
  direccion: string | null
  latitud: number
  longitud: number
  zona_clave: string | null
  conectores: ConectorEstacionDetalle[]
}
