import { Link } from 'react-router'
import { ApiError } from '@/api/errors'
import type { RecomendacionZona } from '@/api/types'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatearEntero, formatearPuntuacion } from '@/lib/format'
import {
  ACCION_LABELS,
  BARRERA_LABELS,
  CONFIANZA_LABELS,
  PRIORIDAD_LABELS,
} from '@/lib/labels'
import { useRecomendacionesZona } from '../useZona'

const fechas = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' })

function formatearFecha(valor: string) {
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  return fechas.format(fecha)
}

function formatearClave(clave: string) {
  const texto = clave.replace(/_/g, ' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function formatearValor(valor: string | number | boolean | null) {
  if (valor === null) return 'Sin evidencia suficiente'
  if (typeof valor === 'number') {
    return Number.isInteger(valor)
      ? formatearEntero(valor)
      : formatearPuntuacion(valor)
  }
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
  return valor
}

function ultimaRecomendacion(recomendaciones: RecomendacionZona[]) {
  return recomendaciones.reduce<RecomendacionZona | null>(
    (ultima, actual) => (!ultima || actual.id > ultima.id ? actual : ultima),
    null,
  )
}

function Detalle({ recomendacion }: { recomendacion: RecomendacionZona }) {
  const razones = Array.isArray(recomendacion.razones)
    ? recomendacion.razones
    : []
  const evidencia = Object.entries(recomendacion.evidencia ?? {})

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="font-serif text-xl leading-7 font-semibold text-primary">
          {ACCION_LABELS[recomendacion.accion]}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-accent px-3 py-1 font-medium text-primary">
            {PRIORIDAD_LABELS[recomendacion.prioridad]}
          </span>
          <span className="rounded-full border px-3 py-1 text-muted-foreground">
            {CONFIANZA_LABELS[recomendacion.confianza]}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Barrera principal:{' '}
          <span className="font-medium text-foreground">
            {BARRERA_LABELS[recomendacion.barrera_principal]}
          </span>
        </p>
      </div>

      {razones.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs tracking-wider text-muted-foreground uppercase">
            Razones
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
            {razones.map((razon) => (
              <li key={razon}>{razon}</li>
            ))}
          </ul>
        </div>
      )}

      {evidencia.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs tracking-wider text-muted-foreground uppercase">
            Evidencia
          </p>
          <dl className="flex flex-col divide-y rounded-md border bg-card text-sm">
            {evidencia.map(([clave, valor]) => (
              <div key={clave} className="flex justify-between gap-4 px-4 py-2">
                <dt className="text-muted-foreground">
                  {formatearClave(clave)}
                </dt>
                <dd className="font-medium text-foreground">
                  {formatearValor(valor)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {recomendacion.version_reglas} ·{' '}
        {formatearFecha(recomendacion.creado_en)}
      </p>
    </div>
  )
}

export function RecomendacionPanel({ clave }: { clave: string }) {
  const { data, error, isPending, isError, refetch, isRefetching } =
    useRecomendacionesZona(clave)

  if (isPending) return <Skeleton className="h-40 w-full" />

  if (isError) {
    const sinSesion = error instanceof ApiError && error.status === 401
    return (
      <div className="flex flex-col items-start gap-3 rounded-md border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          {sinSesion
            ? 'Inicia sesión para ver la recomendación de esta zona.'
            : 'No se pudo cargar la recomendación de esta zona.'}
        </p>
        {sinSesion ? (
          <Link to="/login" className={buttonVariants({ variant: 'outline' })}>
            Iniciar sesión
          </Link>
        ) : (
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            Reintentar
          </Button>
        )}
      </div>
    )
  }

  const ultima = ultimaRecomendacion(data.recomendaciones)

  if (!ultima) {
    return (
      <p className="text-sm text-muted-foreground">
        Sin recomendación disponible
      </p>
    )
  }

  return <Detalle recomendacion={ultima} />
}
