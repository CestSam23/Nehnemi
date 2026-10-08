import { Car, Network, Users, Zap, type LucideIcon } from 'lucide-react'
import type { DimensionIndicador, Indicador } from '@/api/types'
import { NoEvidence } from '@/components/feedback/NoEvidence'
import { DimensionBar } from '@/components/indicadores/DimensionBar'
import { LevelBadge } from '@/components/indicadores/LevelBadge'
import { Card } from '@/components/ui/card'
import { formatearPuntuacion } from '@/lib/format'
import { CONFIANZA_LABELS, DIMENSION_LABELS } from '@/lib/labels'
import { nivelVisual } from '@/lib/levels'

const ORDEN: DimensionIndicador[] = [
  'INFRAESTRUCTURA',
  'ACCESIBILIDAD',
  'ADOPCION',
  'PARTICIPACION',
]

const ICONOS: Record<DimensionIndicador, LucideIcon> = {
  INFRAESTRUCTURA: Zap,
  ACCESIBILIDAD: Network,
  ADOPCION: Car,
  PARTICIPACION: Users,
}

function DimensionZonaCard({ indicador }: { indicador: Indicador }) {
  const Icono = ICONOS[indicador.dimension]
  const nivel = nivelVisual(indicador)
  const conDato = nivel !== 'SIN_DATOS' && indicador.puntuacion !== null

  return (
    <Card className="min-h-52 gap-4 rounded-lg p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-foreground">
          <Icono className="size-4" aria-hidden />
          <h3 className="text-xs font-medium tracking-wide uppercase">
            {DIMENSION_LABELS[indicador.dimension]}
          </h3>
        </div>
        {conDato ? (
          <LevelBadge nivel={nivel} />
        ) : (
          <span className="rounded-sm bg-secondary px-2 py-1 text-xs text-muted-foreground">
            No medible
          </span>
        )}
      </div>

      {conDato ? (
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl leading-none font-semibold text-primary">
              {formatearPuntuacion(indicador.puntuacion!)}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </p>
          <DimensionBar indicador={indicador} className="h-2" />
          {indicador.confianza && (
            <p className="text-xs text-muted-foreground">
              {CONFIANZA_LABELS[indicador.confianza]}
            </p>
          )}
          {indicador.explicacion && (
            <p className="text-xs text-muted-foreground">
              {indicador.explicacion}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-2">
          <NoEvidence />
          <p className="text-xs text-muted-foreground">
            Excluido de cálculo dimensional
          </p>
        </div>
      )}
    </Card>
  )
}

export function DimensionesZona({ indicadores }: { indicadores: Indicador[] }) {
  const porDimension = new Map(indicadores.map((i) => [i.dimension, i]))

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        Dimensiones de evaluación técnica local
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ORDEN.map((dimension) => {
          const indicador = porDimension.get(dimension) ?? {
            dimension,
            disponible: false,
            puntuacion: null,
            nivel: null,
            confianza: null,
            tamano_muestra: null,
            componentes: null,
            explicacion: null,
          }
          return <DimensionZonaCard key={dimension} indicador={indicador} />
        })}
      </div>
    </section>
  )
}
