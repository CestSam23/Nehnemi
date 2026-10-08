import { api } from '@/api/client'
import type {
  RecomendacionesZonaRespuesta,
  ResumenZonaRespuesta,
  SenalesRespuesta,
  SolicitudesZonaRespuesta,
  ZonasMapaParams,
  ZonasMapaRespuesta,
} from '@/api/types'

function rutaZona(clave: string) {
  return `/zonas/${encodeURIComponent(clave)}`
}

export function getResumenZona(clave: string) {
  return api.get<ResumenZonaRespuesta>(`${rutaZona(clave)}/resumen`)
}

export function getSenalesZona(clave: string) {
  return api.get<SenalesRespuesta>(`${rutaZona(clave)}/senales`)
}

export function getSolicitudesZona(clave: string) {
  return api.get<SolicitudesZonaRespuesta>(`${rutaZona(clave)}/solicitudes`)
}

export function getRecomendacionesZona(clave: string) {
  return api.get<RecomendacionesZonaRespuesta>(
    `${rutaZona(clave)}/recomendaciones`,
  )
}

export function getZonasMapa({ tipo, dimension }: ZonasMapaParams) {
  return api.get<ZonasMapaRespuesta>('/zonas/mapa', {
    query: { tipo, dimension },
  })
}
