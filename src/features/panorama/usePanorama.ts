import { useQuery } from '@tanstack/react-query'
import { getPanorama } from '@/api/endpoints/panorama'
import { queryKeys } from '@/api/queryKeys'

export function usePanorama() {
  return useQuery({
    queryKey: queryKeys.panorama,
    queryFn: getPanorama,
  })
}
