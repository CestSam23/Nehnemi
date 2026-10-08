import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { useSesion } from '@/features/auth/useSesion'
import { FiltrosSolicitudes } from './components/FiltrosSolicitudes'
import { Paginacion } from './components/Paginacion'
import { SolicitudesHeader } from './components/SolicitudesHeader'
import { SolicitudesSkeleton } from './components/SolicitudesSkeleton'
import { TablaSolicitudes } from './components/TablaSolicitudes'
import {
  LIMITE_SOLICITUDES,
  useFiltrosSolicitudes,
} from './useFiltrosSolicitudes'
import { useSolicitudes } from './useSolicitudes'

export default function SolicitudesPage() {
  const filtros = useFiltrosSolicitudes()
  const { data: sesion } = useSesion()
  const { data, isPending, isError, isFetching, refetch, isRefetching } =
    useSolicitudes({
      pagina: filtros.pagina,
      limite: LIMITE_SOLICITUDES,
      estado: filtros.estado ?? undefined,
      clave_zona: filtros.zona ?? undefined,
    })

  if (isPending) return <SolicitudesSkeleton />

  if (isError) {
    return <ErrorState onRetry={() => refetch()} reintentando={isRefetching} />
  }

  const hayFiltros = filtros.estado !== null || filtros.zona !== null

  return (
    <div className="flex flex-col gap-8 pb-8">
      <SolicitudesHeader total={data.total} />
      <FiltrosSolicitudes
        key={filtros.zona ?? ''}
        estado={filtros.estado}
        zona={filtros.zona}
        onEstado={filtros.cambiarEstado}
        onZona={filtros.cambiarZona}
        onLimpiar={filtros.limpiar}
      />
      {data.solicitudes.length === 0 ? (
        <EmptyState
          titulo="Sin solicitudes"
          descripcion={
            hayFiltros
              ? 'No hay solicitudes que coincidan con los filtros aplicados.'
              : 'Aún no se han registrado solicitudes de infraestructura.'
          }
          accion={
            hayFiltros && (
              <Button variant="outline" onClick={filtros.limpiar}>
                Limpiar filtros
              </Button>
            )
          }
        />
      ) : (
        <>
          <TablaSolicitudes
            solicitudes={data.solicitudes}
            puedeEditar={sesion?.rol === 'ADMINISTRADOR'}
          />
          <Paginacion
            pagina={data.pagina}
            limite={data.limite}
            total={data.total}
            cargando={isFetching}
            onCambiar={filtros.cambiarPagina}
          />
        </>
      )}
    </div>
  )
}
