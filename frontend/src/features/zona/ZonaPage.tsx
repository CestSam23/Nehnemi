import { Link, useParams } from 'react-router'
import { ApiError } from '@/api/errors'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { buttonVariants } from '@/components/ui/button'
import { DimensionesZona } from './components/DimensionesZona'
import { EvidenciaTerritorial } from './components/EvidenciaTerritorial'
import { RecomendacionZona } from './components/RecomendacionZona'
import { ZonaHeader } from './components/ZonaHeader'
import { ZonaSkeleton } from './components/ZonaSkeleton'
import { useResumenZona } from './useZona'

export default function ZonaPage() {
  const { clave = '' } = useParams()
  const { data, error, isPending, isError, refetch, isRefetching } =
    useResumenZona(clave)

  if (isPending) return <ZonaSkeleton />

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <EmptyState
          titulo="Zona no encontrada"
          descripcion={`No existe una zona activa con la clave ${clave}.`}
          accion={
            <Link to="/mapa" className={buttonVariants({ variant: 'outline' })}>
              Volver al mapa territorial
            </Link>
          }
        />
      )
    }
    return <ErrorState onRetry={() => refetch()} reintentando={isRefetching} />
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <ZonaHeader zona={data} />
      <DimensionesZona indicadores={data.indicadores} />
      <div className="grid items-start gap-6 lg:grid-cols-12">
        <EvidenciaTerritorial zona={data} />
        <RecomendacionZona clave={data.clave} />
      </div>
    </div>
  )
}
