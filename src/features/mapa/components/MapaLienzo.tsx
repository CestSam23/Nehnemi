import 'maplibre-gl/dist/maplibre-gl.css'
import { LoaderCircle, Minus, Plus, ScanLine } from 'lucide-react'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { cn } from '@/lib/utils'
import { limitesDe, type Limites } from '../geometria'
import {
  ANCHO_BORDE,
  CAPA_AGUA,
  CAPA_ETIQUETAS,
  CENTRO_INICIAL,
  FILTRO_SIN_DATOS,
  IMAGEN_SIN_DATOS,
  OPACIDAD_BORDE,
  OPACIDAD_RELLENO,
  PITCH_INICIAL,
  RADIO_ESTACION,
  RADIO_HALO_ESTACION,
  ZOOM_ENTRADA,
  ZOOM_INICIAL,
  crearPatronSinDatos,
  expresionRelleno,
  getEstiloMapa,
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
  const estilo = useMemo(() => getEstiloMapa(paleta), [paleta])
  const animacion = useRef(0)

  useEffect(() => () => cancelAnimationFrame(animacion.current), [])

  function animarMapa(mapa: MapLibreMap) {
    mapa.easeTo({
      zoom: ZOOM_INICIAL,
      pitch: PITCH_INICIAL,
      duration: 2400,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })
    const inicio = performance.now()
    const latir = (ahora: number) => {
      const t = (ahora - inicio) / 1000
      if (mapa.getLayer(CAPA_AGUA)) {
        mapa.setPaintProperty(
          CAPA_AGUA,
          'fill-opacity',
          0.8 + 0.2 * Math.sin(t * 1.4),
        )
      }
      if (mapa.getLayer('estaciones-halo')) {
        mapa.setPaintProperty(
          'estaciones-halo',
          'circle-opacity',
          0.25 + 0.2 * Math.sin(t * 3),
        )
      }
      animacion.current = requestAnimationFrame(latir)
    }
    animacion.current = requestAnimationFrame(latir)
  }
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
    <div className="relative size-full overflow-hidden rounded-[12px] bg-map-fondo">
      <MapaGL
        mapStyle={estilo}
        initialViewState={{
          longitude: CENTRO_INICIAL[0],
          latitude: CENTRO_INICIAL[1],
          zoom: ZOOM_ENTRADA,
          pitch: 0,
        }}
        style={{ width: '100%', height: '100%' }}
        attributionControl={{ compact: true }}
        dragRotate={false}
        maxPitch={60}
        interactiveLayerIds={['zonas-relleno', 'zonas-sin-datos']}
        cursor={bajoCursor ? 'pointer' : 'grab'}
        onLoad={(evento) => {
          evento.target.resize()
          animarMapa(evento.target)
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
            beforeId={CAPA_ETIQUETAS}
            paint={{
              'fill-color': expresionRelleno(paleta),
              'fill-color-transition': { duration: 450 },
              'fill-opacity': OPACIDAD_RELLENO,
            }}
          />
          {patronListo && (
            <Layer
              id="zonas-sin-datos"
              type="fill"
              beforeId={CAPA_ETIQUETAS}
              filter={FILTRO_SIN_DATOS}
              paint={{
                'fill-pattern': IMAGEN_SIN_DATOS,
                'fill-opacity': OPACIDAD_RELLENO,
              }}
            />
          )}
          <Layer
            id="zonas-hover-relleno"
            type="fill"
            beforeId={CAPA_ETIQUETAS}
            filter={['==', ['get', 'clave'], bajoCursor?.clave ?? '']}
            paint={{ 'fill-color': paleta.fondo, 'fill-opacity': 0.25 }}
          />
          <Layer
            id="zonas-borde"
            type="line"
            beforeId={CAPA_ETIQUETAS}
            paint={{
              'line-color': paleta.borde,
              'line-width': ANCHO_BORDE,
              'line-opacity': OPACIDAD_BORDE,
            }}
          />
          <Layer
            id="zonas-hover"
            type="line"
            beforeId={CAPA_ETIQUETAS}
            filter={['==', ['get', 'clave'], bajoCursor?.clave ?? '']}
            layout={{ 'line-join': 'round' }}
            paint={{
              'line-color': paleta.fondo,
              'line-width': 2.5,
              'line-opacity': 1,
            }}
          />
          <Layer
            id="zonas-seleccion-halo"
            type="line"
            beforeId={CAPA_ETIQUETAS}
            filter={['==', ['get', 'clave'], claveSeleccionada ?? '']}
            layout={{ 'line-join': 'round' }}
            paint={{
              'line-color': paleta.seleccion,
              'line-width': 7,
              'line-blur': 1,
            }}
          />
          <Layer
            id="zonas-seleccion"
            type="line"
            beforeId={CAPA_ETIQUETAS}
            filter={['==', ['get', 'clave'], claveSeleccionada ?? '']}
            layout={{ 'line-join': 'round' }}
            paint={{ 'line-color': paleta.fondo, 'line-width': 2.5 }}
          />
        </Source>
        {estaciones && (
          <Source id="estaciones" type="geojson" data={puntosEstaciones}>
            <Layer
              id="estaciones-halo"
              type="circle"
              paint={{
                'circle-radius': RADIO_HALO_ESTACION,
                'circle-color': paleta.estacion,
                'circle-opacity': 0.3,
                'circle-blur': 0.6,
              }}
            />
            <Layer
              id="estaciones-puntos"
              type="circle"
              paint={{
                'circle-radius': RADIO_ESTACION,
                'circle-color': paleta.estacion,
                'circle-stroke-color': paleta.estacionBorde,
                'circle-stroke-width': 1.5,
              }}
            />
          </Source>
        )}
        <ControlesZoom limites={limites} />
      </MapaGL>
      <div className="pointer-events-none absolute top-4 left-4 flex flex-col items-start gap-2">
        <div className="rounded-md bg-card/90 px-4 py-3 shadow-md backdrop-blur-md">
          <p className="font-serif text-xl leading-6 font-semibold text-primary">
            Ciudad de México
          </p>
          <p className="text-xs text-muted-foreground">
            {formatearEntero(datos.features.length)}{' '}
            {datos.features[0]?.properties.tipo === 'AGEB'
              ? 'AGEB'
              : 'alcaldías'}
            {estaciones &&
              ` y ${formatearEntero(estaciones.length)} estaciones de carga`}
          </p>
        </div>
        {actualizando && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-md"
          >
            <LoaderCircle className="size-3 animate-spin" aria-hidden />
            Actualizando mapa
          </p>
        )}
      </div>
      {bajoCursor && (
        <div
          className="pointer-events-none absolute z-10 flex min-w-40 flex-col gap-1 rounded-md bg-primary px-3 py-2 text-primary-foreground shadow-lg"
          style={{ left: bajoCursor.x + 14, top: bajoCursor.y + 14 }}
        >
          <span className="text-xs font-bold">{bajoCursor.nombre}</span>
          {bajoCursor.puntuacion === null ? (
            <span className="text-xs">Sin evidencia suficiente</span>
          ) : (
            <span className="flex items-center gap-2 text-xs">
              <span
                className={cn(
                  'size-2.5 rounded-full ring-1 ring-primary-foreground/60',
                  NIVELES[bajoCursor.nivel].punto,
                )}
              />
              {NIVELES[bajoCursor.nivel].etiqueta}
              <span className="ml-auto font-bold">
                {formatearPuntuacion(bajoCursor.puntuacion)}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
