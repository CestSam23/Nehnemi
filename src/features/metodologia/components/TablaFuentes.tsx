import type { FuenteDatos } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatearFecha } from '@/lib/format'
import { PROCEDENCIA_LABELS } from '@/lib/labels'

const COLUMNAS = 'md:grid-cols-[1.6fr_8rem_1.4fr_9rem_9rem]'
const ES_URL = /^https?:\/\//i

function Referencia({ valor }: { valor: string | null }) {
  if (!valor) return <span className="text-muted-foreground">—</span>
  if (!ES_URL.test(valor)) {
    return <span className="break-words text-muted-foreground">{valor}</span>
  }
  return (
    <a
      href={valor}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium break-all text-primary underline-offset-4 hover:underline"
    >
      {valor}
    </a>
  )
}

export function TablaFuentes({ fuentes }: { fuentes: FuenteDatos[] }) {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg p-0">
      <div
        className={`hidden gap-4 border-b bg-secondary/50 px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:grid ${COLUMNAS}`}
      >
        <span>Fuente</span>
        <span>Tipo</span>
        <span>Referencia</span>
        <span>Fecha de referencia</span>
        <span>Fecha de descarga</span>
      </div>
      <ul className="divide-y">
        {fuentes.map((fuente) => (
          <li
            key={fuente.id}
            className={`grid gap-2 px-6 py-4 text-sm md:items-start md:gap-4 ${COLUMNAS}`}
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-foreground">
                {fuente.nombre}
              </span>
              {fuente.notas && (
                <span className="text-xs text-muted-foreground">
                  {fuente.notas}
                </span>
              )}
            </div>
            <div>
              <Badge variant="outline">
                {PROCEDENCIA_LABELS[fuente.tipo_procedencia]}
              </Badge>
            </div>
            <Referencia valor={fuente.referencia} />
            <span className="text-muted-foreground">
              {formatearFecha(fuente.fecha_referencia)}
            </span>
            <span className="text-muted-foreground">
              {formatearFecha(fuente.fecha_descarga)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
