import { Link } from 'react-router'
import type { ZonaPrioritaria } from '@/api/types'
import {
  ACCION_LABELS,
  BARRERA_LABELS,
  CONFIANZA_LABELS,
  PRIORIDAD_LABELS,
} from '@/lib/labels'

export function ZonasPrioritarias({ zonas }: { zonas: ZonaPrioritaria[] }) {
  if (zonas.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sin zonas prioritarias registradas.
      </p>
    )
  }

  return (
    <ul className="flex flex-col divide-y">
      {zonas.map((zona) => (
        <li key={zona.recomendacion_id}>
          <Link
            to={`/zonas/${zona.clave_zona}`}
            className="flex flex-col gap-2 py-3 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {zona.nombre_zona}
              </span>
              <span className="text-xs text-muted-foreground">
                {zona.clave_zona}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-sm sm:items-end">
              <span className="font-semibold text-primary">
                {ACCION_LABELS[zona.accion]}
              </span>
              <span className="text-xs text-muted-foreground">
                {PRIORIDAD_LABELS[zona.prioridad]} ·{' '}
                {CONFIANZA_LABELS[zona.confianza]} · Barrera:{' '}
                {BARRERA_LABELS[zona.barrera_principal]}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
