import { useQuery } from '@tanstack/react-query'
import { getFuentesDatos } from '@/api/endpoints/fuentes'
import { queryKeys } from '@/api/queryKeys'

export function useFuentes() {
  return useQuery({
    queryKey: queryKeys.fuentes,
    queryFn: getFuentesDatos,
  })
}
