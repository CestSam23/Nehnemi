import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getEstaciones } from '@/api/endpoints/estaciones'
import { getZonasMapa } from '@/api/endpoints/zonas'
import { queryKeys } from '@/api/queryKeys'
import type { ZonasMapaParams } from '@/api/types'
import { reintentar } from '@/lib/reintentar'

const CINCO_MINUTOS = 5 * 60 * 1000

export function useZonasMapa({ tipo, dimension }: ZonasMapaParams) {
  return useQuery({
    queryKey: queryKeys.mapa(tipo, dimension),
    queryFn: () => getZonasMapa({ tipo, dimension }),
    placeholderData: keepPreviousData,
    staleTime: CINCO_MINUTOS,
    retry: reintentar,
  })
}

export function useEstaciones(habilitado: boolean) {
  return useQuery({
    queryKey: queryKeys.estaciones,
    queryFn: getEstaciones,
    enabled: habilitado,
    staleTime: CINCO_MINUTOS,
    retry: reintentar,
  })
}
