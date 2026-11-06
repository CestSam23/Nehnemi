import { useQuery } from '@tanstack/react-query'
import { getSesion } from '@/api/endpoints/auth'
import { queryKeys } from '@/api/queryKeys'

export function useSesion() {
  return useQuery({
    queryKey: queryKeys.sesion,
    queryFn: getSesion,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
