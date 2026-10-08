import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FichaZona } from './components/FichaZona'
import { MapaControles } from './components/MapaControles'
import { MapaLeyenda } from './components/MapaLeyenda'
import { MapaLienzo } from './components/MapaLienzo'
import { MapaSkeleton } from './components/MapaSkeleton'
import { useFiltrosMapa } from './useFiltrosMapa'
import { useEstaciones, useZonasMapa } from './useMapa'

export default function MapaPage() {
  const filtros = useFiltrosMapa()
  const mapa = useZonasMapa({
    tipo: filtros.tipo,
    dimension: filtros.dimension,
  })
  const estaciones = useEstaciones(filtros.estaciones)

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="sr-only">Mapa territorial</h1>
      <MapaControles
        dimension={filtros.dimension}
        onDimension={filtros.cambiarDimension}
        tipo={filtros.tipo}
        onTipo={filtros.cambiarTipo}
        estaciones={filtros.estaciones}
        onEstaciones={filtros.cambiarEstaciones}
        errorEstaciones={estaciones.isError}
      />
      <MapaLeyenda dimension={filtros.dimension} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19.5rem]">
        <section
          aria-label="Mapa de zonas"
          className="h-[520px] rounded-[16px] border bg-card p-4 shadow-xs lg:h-[730px]"
        >
          {mapa.isPending ? (
            <MapaSkeleton />
          ) : mapa.isError ? (
            <ErrorState
              onRetry={() => mapa.refetch()}
              reintentando={mapa.isRefetching}
              className="h-full justify-center"
            />
          ) : mapa.data.features.length === 0 ? (
            <EmptyState
              titulo="Sin zonas para mostrar"
              descripcion="La API no devolvió zonas con geometría para esta selección."
              className="h-full justify-center"
            />
          ) : (
            <MapaLienzo
              datos={mapa.data}
              claveSeleccionada={filtros.zona}
              onSeleccionar={filtros.seleccionarZona}
              estaciones={filtros.estaciones ? estaciones.data : undefined}
              actualizando={mapa.isPlaceholderData}
            />
          )}
        </section>
        <aside
          aria-label="Ficha de zona seleccionada"
          className="rounded-lg border bg-card p-6 shadow-xs"
        >
          {filtros.zona ? (
            <FichaZona clave={filtros.zona} dimension={filtros.dimension} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Selecciona una zona en el mapa para ver su ficha territorial.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
