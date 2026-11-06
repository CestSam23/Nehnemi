import type { SolicitudInfraestructura } from '@/api/types'
import { Card } from '@/components/ui/card'
import { MOTIVO_LABELS } from '@/lib/labels'
import { CambiarEstado } from './CambiarEstado'
import { EstadoBadge } from './EstadoBadge'

const fechas = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' })

function formatearFecha(valor: string) {
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  return fechas.format(fecha)
}

const COLUMNAS = 'md:grid-cols-[8rem_1fr_9rem_8rem_1.2fr]'

export function TablaSolicitudes({
  solicitudes,
  puedeEditar,
}: {
  solicitudes: SolicitudInfraestructura[]
  puedeEditar: boolean
}) {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg p-0">
      <div
        className={`hidden gap-4 border-b bg-secondary/50 px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:grid ${COLUMNAS}`}
      >
        <span>Zona</span>
        <span>Motivo</span>
        <span>Estado</span>
        <span>Fecha</span>
        <span>Comentario</span>
      </div>
      <ul className="divide-y">
        {solicitudes.map((solicitud) => (
          <li
            key={solicitud.id}
            className={`grid gap-2 px-6 py-4 text-sm md:items-center md:gap-4 ${COLUMNAS}`}
          >
            <span className="font-semibold text-primary">
              {solicitud.zona_clave}
            </span>
            <span className="font-medium text-foreground">
              {MOTIVO_LABELS[solicitud.motivo]}
            </span>
            <div>
              {puedeEditar ? (
                <CambiarEstado solicitud={solicitud} />
              ) : (
                <EstadoBadge estado={solicitud.estado} />
              )}
            </div>
            <span className="text-muted-foreground">
              {formatearFecha(solicitud.creado_en)}
            </span>
            <span
              className="truncate text-muted-foreground"
              title={solicitud.comentario ?? undefined}
            >
              {solicitud.comentario || '—'}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
