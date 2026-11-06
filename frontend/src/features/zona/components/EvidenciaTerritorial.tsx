import { Home, Inbox, Navigation, PlugZap, Zap } from 'lucide-react'
import { Link } from 'react-router'
import type { ResumenZonaRespuesta } from '@/api/types'
import { IndicadorDato } from '@/components/indicadores/IndicadorDato'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatearEntero, formatearMetros } from '@/lib/format'
import { useSenalesZona, useSolicitudesZona } from '../useZona'

export function EvidenciaTerritorial({ zona }: { zona: ResumenZonaRespuesta }) {
  const senales = useSenalesZona(zona.clave)
  const solicitudes = useSolicitudesZona(zona.clave)
  const { infraestructura } = zona

  const viviendas = senales.data?.senales.find(
    (senal) => senal.codigo === 'VIVIENDAS_CON_AUTOMOVIL',
  )?.valor
  const viviendasTexto =
    typeof viviendas === 'number'
      ? formatearEntero(viviendas)
      : (viviendas ?? null)

  return (
    <Card className="gap-6 rounded-lg p-8 lg:col-span-7">
      <div className="flex flex-col gap-0.5">
        <p className="text-xs tracking-wider text-muted-foreground uppercase">
          Levantamiento censal y catastral
        </p>
        <h2 className="font-serif text-2xl leading-8 font-semibold text-primary">
          Evidencia territorial
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <IndicadorDato
          icono={Zap}
          valor={
            infraestructura ? formatearEntero(infraestructura.estaciones) : null
          }
          etiqueta="Estaciones de carga públicas"
        />
        <IndicadorDato
          icono={PlugZap}
          valor={
            infraestructura ? formatearEntero(infraestructura.conectores) : null
          }
          etiqueta="Conectores instalados"
        />
        <IndicadorDato
          icono={Navigation}
          valor={
            infraestructura?.distancia_estacion_m != null
              ? formatearMetros(infraestructura.distancia_estacion_m)
              : null
          }
          etiqueta="Distancia a estación más cercana"
        />
        <IndicadorDato
          icono={Home}
          valor={viviendasTexto}
          etiqueta="Viviendas particulares con automóvil"
          cargando={senales.isPending}
        />
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border border-primary bg-card p-4">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center text-primary">
            <Inbox className="size-5" aria-hidden />
          </span>
          <div className="flex flex-col gap-0.5">
            {solicitudes.isPending ? (
              <Skeleton className="h-5 w-56" />
            ) : solicitudes.isError ? (
              <p className="text-sm font-bold text-muted-foreground">
                Sin evidencia suficiente
              </p>
            ) : (
              <p className="text-sm font-medium text-primary">
                {formatearEntero(solicitudes.data.total)}{' '}
                {solicitudes.data.total === 1
                  ? 'solicitud ciudadana registrada'
                  : 'solicitudes ciudadanas registradas'}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Ventanilla única digital y mesas de movilidad
            </p>
          </div>
        </div>
        {solicitudes.data && solicitudes.data.total === 0 && (
          <span className="rounded-full border border-primary px-3 py-1 text-xs text-muted-foreground">
            Sin trámite
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Procedencia, fechas de referencia y fórmulas en{' '}
        <Link
          to="/metodologia"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Datos y metodología
        </Link>
        .
      </p>
    </Card>
  )
}
