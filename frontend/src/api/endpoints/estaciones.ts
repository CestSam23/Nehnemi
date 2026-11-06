import { api } from '@/api/client'
import type { EstacionCargaListado } from '@/api/types'

export function getEstaciones() {
  return api.get<EstacionCargaListado[]>('/estaciones-carga')
}
