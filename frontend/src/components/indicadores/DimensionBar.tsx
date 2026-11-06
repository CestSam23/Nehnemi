import { NoEvidence } from '@/components/feedback/NoEvidence'
import { NIVELES, nivelVisual } from '@/lib/levels'
import type { Indicador } from '@/api/types'
import { cn } from '@/lib/utils'

export function DimensionBar({
  indicador,
  motivo,
  className,
}: {
  indicador: Pick<Indicador, 'disponible' | 'nivel' | 'puntuacion'>
  motivo?: string | null
  className?: string
}) {
  const nivel = nivelVisual(indicador)

  if (nivel === 'SIN_DATOS' || indicador.puntuacion === null) {
    return <NoEvidence motivo={motivo} className={className} />
  }

  const ancho = Math.min(100, Math.max(0, indicador.puntuacion))

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indicador.puntuacion}
      className={cn(
        'h-3 w-full overflow-hidden rounded-full bg-muted',
        className,
      )}
    >
      <div
        className={cn('h-full rounded-full', NIVELES[nivel].barra)}
        style={{ width: `${ancho}%` }}
      />
    </div>
  )
}
