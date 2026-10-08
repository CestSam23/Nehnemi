import 'maplibre-gl/dist/maplibre-gl.css'
import { LoaderCircle, Minus, Plus, ScanLine } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Layer,
  Map as MapaGL,
  Source,
  useMap,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre'
import type {
  EstacionCargaListado,
  NivelIndicador,
  ZonasMapaRespuesta,
} from '@/api/types'
import { Button } from '@/components/ui/button'
import { formatearEntero, formatearPuntuacion } from '@/lib/format'
import { NIVELES, nivelVisual, type NivelVisual } from '@/lib/levels'
import { limitesDe, type Limites } from '../geometria'
import {
  FILTRO_SIN_DATOS,
  IMAGEN_SIN_DATOS,
  crearEstilo,
  crearPatronSinDatos,
  expresionRelleno,
  leerPaleta,
} from '../mapaEstilo'

type ZonaBajoCursor = {
  clave: string
  nombre: string
  nivel: NivelVisual
  puntuacion: number | null
  x: number
  y: number
}

const ANCHO_BORDE = 0.6

function ControlesZoom({ limites }: { limites: Limites }) {
  const { current: mapa } = useMap()

  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-2">
      <div className="flex items-center rounded-[12px] border border-primary bg-card p-1 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          className="w-11"
          aria-label="Acercar"
          onClick={() => mapa?.zoomIn()}
        >
          <Plus />
        </Button>
        <span className="h-6 w-px bg-secondary" aria-hidden />
        <Button
          variant="ghost"
          size="icon"
          className="w-11"
          aria-label="Alejar"
          onClick={() => mapa?.zoomOut()}
        >
          <Minus />
        </Button>
      </div>
      <Button
        variant="outline"
        className="shadow-md"
        onClick={() => mapa?.fitBounds(limites, { padding: 24, duration: 600 })}
      >
        <ScanLine />
        Recentrar
      </Button>
    </div>
  )
}

export function MapaLienzo({
  datos,
  claveSeleccionada,
  onSeleccionar,
  estaciones,
  actualizando,
}: {
  datos: ZonasMapaRespuesta
  claveSeleccionada: string | null
  onSeleccionar: (clave: string | null) => void
  estaciones: EstacionCargaListado[] | undefined
  actualizando: boolean
}) {
  const [bajoCursor, setBajoCursor] = useState<ZonaBajoCursor | null>(null)
  const [patronListo, setPatronListo] = useState(false)

  const paleta = useMemo(() => leerPaleta(), [])
  const estilo = useMemo(() => crearEstilo(paleta), [paleta])
  const limites = useMemo(() => limitesDe(datos.features), [datos.features])

  const puntosEstaciones = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: (estaciones ?? []).map((estacion) => ({
        type: 'Feature' as const,
        properties: { id: estacion.id },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            estacion.ubicacion.longitud,
            estacion.ubicacion.latitud,
          ],
        },
      })),
    }),
    [estaciones],
  )

  if (!limites) return null

  function alMover(evento: MapLayerMouseEvent) {
    const propiedades = evento.features?.[0]?.properties
    if (!propiedades) {
      setBajoCursor(null)
      return
    }
    const nivel =
      typeof propiedades.nivel === 'string' && propiedades.nivel in NIVELES
        ? (propiedades.nivel as NivelIndicador)
        : null
    setBajoCursor({
      clave: String(propiedades.clave),
      nombre: String(propiedades.nombre),
      nivel: nivelVisual({
        disponible: propiedades.disponible === true,
        nivel,
      }),
      puntuacion:
        typeof propiedades.puntuacion === 'number'
          ? propiedades.puntuacion
          : null,
      x: evento.point.x,
      y: evento.point.y,
    })
  }

  function alClic(evento: MapLayerMouseEvent) {
    const clave = evento.features?.[0]?.properties?.clave
    onSeleccionar(clave ? String(clave) : null)
  }

  return (
    <div className="relative size-full overflow-hidden rounded-[12px] bg-card">
      <MapaGL
        mapStyle={estilo}
        initialViewState={{
          bounds: limites,
          fitBoundsOptions: { padding: 24 },
        }}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        dragRotate={false}
        maxPitch={0}
        interactiveLayerIds={['zonas-relleno', 'zonas-sin-datos']}
        cursor={bajoCursor ? 'pointer' : 'grab'}
        onLoad={(evento) => {
          evento.target.resize()
          evento.target.fitBounds(limites, { padding: 24, duration: 0 })
          const imagen = crearPatronSinDatos(paleta)
          if (!imagen) return
          evento.target.addImage(IMAGEN_SIN_DATOS, imagen)
          setPatronListo(true)
        }}
        onMouseMove={alMover}
        onMouseLeave={() => setBajoCursor(null)}
        onClick={alClic}
      >
        <Source id="zonas" type="geojson" data={datos as never}>
          <Layer
            id="zonas-relleno"
            type="fill"
            paint={{ 'fill-color': expresionRelleno(paleta) }}
          />
          {patronListo && (
            <Layer
              id="zonas-sin-datos"
              type="fill"
              filter={FILTRO_SIN_DATOS}
              paint={{ 'fill-pattern': IMAGEN_SIN_DATOS }}
            />
          )}
          <Layer
            id="zonas-borde"
            type="line"
            paint={{
              'line-color': paleta.borde,
              'line-width': ANCHO_BORDE,
            }}
          />
          <Layer
            id="zonas-hover"
            type="line"
            filter={['==', ['get', 'clave'], bajoCursor?.clave ?? '']}
            paint={{
              'line-color': paleta.seleccion,
              'line-width': 2,
              'line-opacity': 0.7,
            }}
          />
          <Layer
            id="zonas-seleccion"
            type="line"
            filter={['==', ['get', 'clave'], claveSeleccionada ?? '']}
            paint={{ 'line-color': paleta.seleccion, 'line-width': 4 }}
          />
        </Source>
        {estaciones && (
          <Source id="estaciones" type="geojson" data={puntosEstaciones}>
            <Layer
              id="estaciones-puntos"
              type="circle"
              paint={{
                'circle-radius': 3.5,
                'circle-color': paleta.estacion,
                'circle-stroke-color': paleta.estacionBorde,
                'circle-stroke-width': 1,
              }}
            />
          </Source>
        )}
        <ControlesZoom limites={limites} />
      </MapaGL>
      <div className="pointer-events-none absolute top-4 left-4 flex flex-col items-start gap-1">
        <p className="rounded-[8px] bg-card/95 px-3 py-2 text-[11px] font-medium text-muted-foreground shadow-xs backdrop-blur-sm">
          <span className="font-bold text-primary">CDMX</span> ·{' '}
          {formatearEntero(datos.features.length)}{' '}
          {datos.features[0]?.properties.tipo === 'AGEB' ? 'AGEB' : 'alcaldías'}
        </p>
        {estaciones && (
          <p className="flex items-center gap-2 rounded-sm bg-accent px-2.5 py-1 text-[11px] font-medium text-primary shadow-xs">
            <span className="size-1.5 rounded-full bg-success" />
            {formatearEntero(estaciones.length)} estaciones en el mapa
          </p>
        )}
        {actualizando && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-sm bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-xs"
          >
            <LoaderCircle className="size-3 animate-spin" aria-hidden />
            Actualizando mapa
          </p>
        )}
      </div>
      {bajoCursor && (
        <div
          className="pointer-events-none absolute z-10 flex flex-col gap-0.5 rounded-sm bg-primary px-2 py-1.5 text-primary-foreground shadow-md"
          style={{ left: bajoCursor.x + 14, top: bajoCursor.y + 14 }}
        >
          <span className="text-[11px] font-bold">{bajoCursor.nombre}</span>
          <span className="text-[11px] font-medium">
            {bajoCursor.puntuacion === null
              ? 'Sin evidencia suficiente'
              : `${NIVELES[bajoCursor.nivel].etiqueta} · ${formatearPuntuacion(bajoCursor.puntuacion)}`}
          </span>
        </div>
      )}
    </div>
  )
}
