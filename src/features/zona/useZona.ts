import { useQuery } from '@tanstack/react-query'
import {
  getRecomendacionesZona,
  getResumenZona,
  getSenalesZona,
  getSolicitudesZona,
} from '@/api/endpoints/zonas'
import { queryKeys } from '@/api/queryKeys'
import { reintentar } from '@/lib/reintentar'

export function useResumenZona(clave: string) {
  return useQuery({
    queryKey: queryKeys.zona.resumen(clave),
    queryFn: () => getResumenZona(clave),
    retry: reintentar,
  })
}

export function useSenalesZona(clave: string) {
  return useQuery({
    queryKey: queryKeys.zona.senales(clave),
    queryFn: () => getSenalesZona(clave),
    retry: reintentar,
  })
}

export function useRecomendacionesZona(clave: string) {
  return useQuery({
    queryKey: queryKeys.zona.recomendaciones(clave),
    queryFn: () => getRecomendacionesZona(clave),
    retry: reintentar,
  })
}

export function useSolicitudesZona(clave: string) {
  return useQuery({
    queryKey: queryKeys.zona.solicitudes(clave),
    queryFn: () => getSolicitudesZona(clave),
    retry: reintentar,
  })
}
