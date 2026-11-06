import { useQuery } from '@tanstack/react-query'
import { getPanorama } from '@/api/endpoints/panorama'
import { queryKeys } from '@/api/queryKeys'

export function usePanorama(enabled = true) {
  return useQuery({
    queryKey: queryKeys.panorama,
    queryFn: getPanorama,
    enabled,
  })
}
