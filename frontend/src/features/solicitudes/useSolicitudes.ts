import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  actualizarEstadoSolicitud,
  getSolicitudes,
} from '@/api/endpoints/solicitudes'
import { queryKeys } from '@/api/queryKeys'
import type { EstadoSolicitud, SolicitudesParams } from '@/api/types'

export function useSolicitudes(params: SolicitudesParams) {
  return useQuery({
    queryKey: queryKeys.solicitudes.listado(params),
    queryFn: () => getSolicitudes(params),
    placeholderData: keepPreviousData,
  })
}

export function useActualizarEstadoSolicitud() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoSolicitud }) =>
      actualizarEstadoSolicitud(id, estado),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.solicitudes.todas }),
  })
}
