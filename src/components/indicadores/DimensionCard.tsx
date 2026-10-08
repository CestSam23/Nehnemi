import type { Indicador } from '@/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CONFIANZA_LABELS, DIMENSION_LABELS } from '@/lib/labels'
import { nivelVisual } from '@/lib/levels'
import { cn } from '@/lib/utils'
import { DimensionBar } from './DimensionBar'
import { LevelBadge } from './LevelBadge'

export function DimensionCard({
  indicador,
  motivo,
  className,
}: {
  indicador: Indicador
  motivo?: string | null
  className?: string
}) {
  const nivel = nivelVisual(indicador)
  const conDato = nivel !== 'SIN_DATOS' && indicador.puntuacion !== null

  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader className="flex items-start justify-between gap-3">
        <CardTitle className="font-serif text-lg font-semibold">
          {DIMENSION_LABELS[indicador.dimension]}
        </CardTitle>
        <LevelBadge nivel={nivel} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {conDato && (
          <p className="font-serif text-3xl font-semibold text-foreground">
            {indicador.puntuacion}
          </p>
        )}
        <DimensionBar indicador={indicador} motivo={motivo} />
        {conDato && indicador.confianza && (
          <p className="text-xs text-muted-foreground">
            {CONFIANZA_LABELS[indicador.confianza]}
          </p>
        )}
        {conDato && indicador.explicacion && (
          <p className="text-sm text-muted-foreground">
            {indicador.explicacion}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
