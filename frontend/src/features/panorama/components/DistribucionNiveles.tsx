import { useState } from 'react'
import type {
  DimensionIndicador,
  DistribucionDimension,
  NivelIndicador,
} from '@/api/types'
import { NoEvidence } from '@/components/feedback/NoEvidence'
import { DIMENSIONES } from '@/lib/enums'
import { formatearEntero } from '@/lib/format'
import { DIMENSION_LABELS } from '@/lib/labels'
import { NIVELES } from '@/lib/levels'
import { cn } from '@/lib/utils'

const ORDEN_NIVELES: NivelIndicador[] = ['MUY_BAJA', 'BAJA', 'MEDIA', 'ALTA']

export function DistribucionNiveles({
  distribuciones,
}: {
  distribuciones: Record<DimensionIndicador, DistribucionDimension>
}) {
  const [dimension, setDimension] =
    useState<DimensionIndicador>('INFRAESTRUCTURA')
  const actual = distribuciones[dimension]

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Dimensión"
        className="flex flex-wrap gap-2"
      >
        {DIMENSIONES.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={item === dimension}
            onClick={() => setDimension(item)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
              item === dimension
                ? 'border-primary bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-accent',
            )}
          >
            {DIMENSION_LABELS[item]}
          </button>
        ))}
      </div>

      {actual.disponibles === 0 ? (
        <NoEvidence motivo="Aún no hay AGEB con datos suficientes para esta dimensión." />
      ) : (
        <>
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`Distribución de niveles de ${DIMENSION_LABELS[dimension]}`}
          >
            {ORDEN_NIVELES.map((nivel) => (
              <div
                key={nivel}
                className={NIVELES[nivel].barra}
                style={{
                  width: `${(actual.niveles[nivel] / actual.disponibles) * 100}%`,
                }}
              />
            ))}
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {ORDEN_NIVELES.map((nivel) => (
              <li key={nivel} className="flex items-center gap-2 text-sm">
                <span
                  className={cn('size-2.5 rounded-full', NIVELES[nivel].punto)}
                  aria-hidden
                />
                <span className="text-muted-foreground">
                  {NIVELES[nivel].etiqueta}
                </span>
                <span className="ml-auto font-semibold text-foreground">
                  {formatearEntero(actual.niveles[nivel])}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            {formatearEntero(actual.disponibles)} AGEB con datos ·{' '}
            {formatearEntero(actual.sin_datos)} sin datos
          </p>
        </>
      )}
    </div>
  )
}
