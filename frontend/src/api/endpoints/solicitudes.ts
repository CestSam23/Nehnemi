import { api } from '@/api/client'
import type {
  ActualizarSolicitudBody,
  EstadoSolicitud,
  SolicitudInfraestructura,
  SolicitudesListadoRespuesta,
  SolicitudesParams,
} from '@/api/types'

export function getSolicitudes(params: SolicitudesParams) {
  return api.get<SolicitudesListadoRespuesta>('/solicitudes-infraestructura', {
    query: params,
  })
}

export function actualizarEstadoSolicitud(id: string, estado: EstadoSolicitud) {
  const body: ActualizarSolicitudBody = { estado }
  return api.patch<SolicitudInfraestructura>(
    `/solicitudes-infraestructura/${encodeURIComponent(id)}`,
    body,
  )
}
