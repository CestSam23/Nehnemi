import { api } from '@/api/client'
import type { FuenteDatos } from '@/api/types'

export function getFuentesDatos() {
  return api.get<FuenteDatos[]>('/fuentes-datos')
}
