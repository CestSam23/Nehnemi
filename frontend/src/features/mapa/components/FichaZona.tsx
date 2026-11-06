import { Building2, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import { ApiError } from '@/api/errors'
import type { DimensionIndicador, ResumenZonaRespuesta } from '@/api/types'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { NoEvidence } from '@/components/feedback/NoEvidence'
import { DimensionBar } from '@/components/indicadores/DimensionBar'
import { LevelBadge } from '@/components/indicadores/LevelBadge'
import { buttonVariants } from '@/components/ui/button'
import { DIMENSIONES } from '@/lib/enums'
import {
  formatearEntero,
  formatearMetros,
  formatearPuntuacion,
} from '@/lib/format'
import { DIMENSION_LABELS, TIPO_ZONA_LABELS } from '@/lib/labels'
import { NIVELES, nivelVisual } from '@/lib/levels'
import { cn } from '@/lib/utils'
import { useResumenZona } from '../../zona/useZona'
import { FichaSkeleton } from './MapaSkeleton'

function DimensionActiva({
  resumen,
  dimension,
}: {
  resumen: ResumenZonaRespuesta
  dimension: DimensionIndicador
}) {
  const indicador = resumen.indicadores.find((i) => i.dimension === dimension)

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border bg-secondary p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs font-medium text-primary">
          <Building2 className="size-[15px]" aria-hidden />
          Dimensión: {DIMENSION_LABELS[dimension]}
        </p>
        {indicador && <LevelBadge nivel={nivelVisual(indicador)} />}
      </div>
      {indicador && indicador.puntuacion !== null ? (
        <>
          <p className="flex items-baseline gap-2 pt-1">
            <span className="font-serif text-2xl text-primary">
              {formatearPuntuacion(indicador.puntuacion)}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              / 100
            </span>
          </p>
          <DimensionBar indicador={indicador} className="h-2" />
        </>
      ) : (
        <NoEvidence motivo={indicador?.explicacion} />
      )}
    </div>
  )
}

function Desglose({ resumen }: { resumen: ResumenZonaRespuesta }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[11px] font-medium tracking-[0.05em] text-muted-foreground uppercase">
        Desglose dimensional independiente:
      </h3>
      <ul className="flex flex-col gap-2">
        {DIMENSIONES.map((dimension) => {
          const indicador = resumen.indicadores.find(
            (i) => i.dimension === dimension,
          )
          const nivel = indicador ? nivelVisual(indicador) : 'SIN_DATOS'
          return (
            <li
              key={dimension}
              className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-[8px] border border-primary bg-background p-2.5"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <span
                  className={cn('size-2 rounded-full', NIVELES[nivel].punto)}
                />
                {DIMENSION_LABELS[dimension]}
              </span>
              {indicador && indicador.puntuacion !== null ? (
                <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                  {formatearPuntuacion(indicador.puntuacion)}
                  <LevelBadge nivel={nivel} className="text-[10px]" />
                </span>
              ) : (
                <span className="text-[11px] font-medium text-muted-foreground">
                  Sin evidencia suficiente
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Inventario({ resumen }: { resumen: ResumenZonaRespuesta }) {
  const infraestructura = resumen.infraestructura

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border bg-background p-4">
      <h3 className="text-[11px] font-medium tracking-[0.05em] text-muted-foreground uppercase">
        Resumen de inventario censado:
      </h3>
      {infraestructura ? (
        <>
          <dl className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-[8px] border border-primary bg-card p-2">
              <dt className="text-[10px] font-medium text-muted-foreground">
                Estaciones
              </dt>
              <dd className="font-serif text-base text-primary">
                {formatearEntero(infraestructura.estaciones)}
              </dd>
            </div>
            <div className="rounded-[8px] border border-primary bg-card p-2">
              <dt className="text-[10px] font-medium text-muted-foreground">
                Conectores
              </dt>
              <dd className="font-serif text-base text-primary">
                {formatearEntero(infraestructura.conectores)}
              </dd>
            </div>
          </dl>
          {infraestructura.distancia_estacion_m !== null && (
            <p className="flex items-start gap-2 border-t border-secondary pt-2 text-[11px] font-medium text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Estación más cercana a{' '}
              {formatearMetros(infraestructura.distancia_estacion_m)}.
            </p>
          )}
        </>
      ) : (
        <NoEvidence />
      )}
    </div>
  )
}

export function FichaZona({
  clave,
  dimension,
}: {
  clave: string
  dimension: DimensionIndicador
}) {
  const { data, error, isPending, isError, refetch, isRefetching } =
    useResumenZona(clave)

  if (isPending) return <FichaSkeleton />

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <EmptyState
          titulo="Zona no encontrada"
          descripcion={`No existe una zona activa con la clave ${clave}.`}
          className="px-0"
        />
      )
    }
    return (
      <ErrorState
        titulo="No pudimos cargar la ficha"
        onRetry={() => refetch()}
        reintentando={isRefetching}
        className="px-0"
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-primary">
            {TIPO_ZONA_LABELS[data.tipo]}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            ID: {data.clave}
          </span>
        </div>
        <h2 className="pt-1 font-serif text-base leading-6 text-primary">
          {data.nombre}
        </h2>
      </div>
      <DimensionActiva resumen={data} dimension={dimension} />
      <Desglose resumen={data} />
      <Inventario resumen={data} />
      <Link
        to={`/zonas/${encodeURIComponent(data.clave)}`}
        className={buttonVariants({ variant: 'outline' })}
      >
        Ver detalle de zona
      </Link>
    </div>
  )
}
