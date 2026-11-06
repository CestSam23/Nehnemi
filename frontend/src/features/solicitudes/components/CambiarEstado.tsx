import type { EstadoSolicitud, SolicitudInfraestructura } from '@/api/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ESTADO_SOLICITUD_LABEL } from '@/lib/labels'
import { ESTADOS_SOLICITUD } from '../useFiltrosSolicitudes'
import { useActualizarEstadoSolicitud } from '../useSolicitudes'

export function CambiarEstado({
  solicitud,
}: {
  solicitud: SolicitudInfraestructura
}) {
  const { mutate, isPending, isError, reset } = useActualizarEstadoSolicitud()

  return (
    <div className="flex flex-col gap-1">
      <Select
        value={solicitud.estado}
        disabled={isPending}
        onValueChange={(valor) => {
          reset()
          mutate({ id: solicitud.id, estado: valor as EstadoSolicitud })
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Cambiar estado de la solicitud"
          className="w-40"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          {ESTADOS_SOLICITUD.map((estado) => (
            <SelectItem key={estado} value={estado}>
              {ESTADO_SOLICITUD_LABEL[estado]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isError && (
        <p role="alert" className="text-xs font-medium text-error-text">
          No se pudo actualizar el estado.
        </p>
      )}
    </div>
  )
}
