import { api } from '@/api/client'
import type {
  IniciarSesionBody,
  IniciarSesionRespuesta,
  SesionRespuesta,
} from '@/api/types'

export function getSesion() {
  return api.get<SesionRespuesta>('/autenticacion/sesion')
}

export function iniciarSesion(body: IniciarSesionBody) {
  return api.post<IniciarSesionRespuesta>('/autenticacion/iniciar-sesion', body)
}
