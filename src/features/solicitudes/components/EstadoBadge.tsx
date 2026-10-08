import type { EstadoSolicitud } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import { ESTADO_SOLICITUD_COLORS, ESTADO_SOLICITUD_LABEL } from '@/lib/labels'
import { cn } from '@/lib/utils'

export function EstadoBadge({ estado }: { estado: EstadoSolicitud }) {
  return (
    <Badge
      className={cn('px-3 py-1 font-semibold', ESTADO_SOLICITUD_COLORS[estado])}
    >
      {ESTADO_SOLICITUD_LABEL[estado]}
    </Badge>
  )
}
