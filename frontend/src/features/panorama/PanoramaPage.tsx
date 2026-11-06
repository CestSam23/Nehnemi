import estacionIcon from '@/assets/panorama/estacion.svg'
import rayoIcon from '@/assets/panorama/rayo.svg'
import { ErrorState } from '@/components/feedback/ErrorState'
import { StatCard } from '@/components/indicadores/StatCard'
import { formatearEntero, formatearKw } from '@/lib/format'
import { DistribucionNiveles } from './components/DistribucionNiveles'
import { PanoramaHeader } from './components/PanoramaHeader'
import { PanoramaSkeleton } from './components/PanoramaSkeleton'
import { ParticipacionPanorama } from './components/ParticipacionPanorama'
import { SeccionPanorama } from './components/SeccionPanorama'
import { VentasEvCard } from './components/VentasEvCard'
import { ZonasPrioritarias } from './components/ZonasPrioritarias'
import { usePanorama } from './usePanorama'

export default function PanoramaPage() {
  const { data, isPending, isError, refetch, isRefetching } = usePanorama()

  if (isPending) return <PanoramaSkeleton />

  if (isError) {
    return <ErrorState onRetry={() => refetch()} reintentando={isRefetching} />
  }

  const {
    cobertura_territorial,
    infraestructura,
    distribuciones,
    ventas_ev,
    zonas_prioritarias,
    participacion,
    solicitudes,
  } = data

  return (
    <div className="flex flex-col gap-8 pb-8">
      <PanoramaHeader />

      <section className="grid items-stretch gap-6 lg:grid-cols-3">
        <StatCard
          eyebrow="Catastro territorial"
          etiqueta="AGEB analizadas"
          adorno={
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">
              {formatearEntero(cobertura_territorial.alcaldias)} alcaldías
            </span>
          }
          valor={formatearEntero(cobertura_territorial.agebs)}
        />
        <StatCard
          eyebrow="Infraestructura fija"
          etiqueta="Estaciones de carga"
          adorno={
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
              <img src={estacionIcon} alt="" className="size-[13.5px]" />
            </span>
          }
          valor={formatearEntero(infraestructura.estaciones_registradas)}
          nota={
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">
              estaciones registradas
            </span>
          }
        />
        <StatCard
          eyebrow="Capacidad de suministro"
          etiqueta="Conectores registrados"
          adorno={
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
              <img src={rayoIcon} alt="" className="h-[15px] w-3" />
            </span>
          }
          valor={formatearEntero(infraestructura.conectores_registrados)}
          nota={
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                {formatearKw(
                  infraestructura.potencia_nominal_agregada_kw ??
                    infraestructura.potencia_total_kw,
                )}{' '}
                de potencia nominal agregada
              </span>
              {infraestructura.estado_operativo_verificado ? (
                <span className="text-xs font-bold tracking-wide text-success">
                  Estado operativo verificado
                </span>
              ) : (
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                  Estado operativo sin verificar
                </span>
              )}
            </div>
          }
        />
      </section>

      <section className="grid items-stretch gap-6 lg:grid-cols-2">
        <SeccionPanorama
          titulo="Distribución de niveles"
          descripcion="Número de AGEB por nivel en cada dimensión del indicador."
        >
          <DistribucionNiveles distribuciones={distribuciones} />
        </SeccionPanorama>
        <SeccionPanorama
          titulo="Ventas de vehículos eléctricos"
          descripcion="Ventas mensuales registradas de vehículos eléctricos en la Ciudad de México."
        >
          <VentasEvCard ventas={ventas_ev} />
        </SeccionPanorama>
      </section>

      <SeccionPanorama
        titulo="Zonas prioritarias"
        descripcion="Zonas con recomendación vigente, ordenadas según la API."
      >
        <ZonasPrioritarias zonas={zonas_prioritarias} />
      </SeccionPanorama>

      <ParticipacionPanorama
        participacion={participacion}
        solicitudes={solicitudes}
      />
    </div>
  )
}
