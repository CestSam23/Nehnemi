import type { ExpressionSpecification, StyleSpecification } from 'maplibre-gl'
import type { NivelIndicador } from '@/api/types'
import { NIVELES } from '@/lib/levels'

export const IMAGEN_SIN_DATOS = 'sin-datos'

export type PaletaMapa = {
  fondo: string
  lienzo: string
  contorno: string
  borde: string
  seleccion: string
  sinDatos: string
  sinDatosTrazo: string
  estacion: string
  estacionBorde: string
  agua: string
  aguaBrillo: string
  parque: string
  calle: string
  calleBorde: string
  edificio: string
  texto: string
  niveles: Record<NivelIndicador, string>
}

function leerToken(nombre: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(nombre)
    .trim()
}

export function leerPaleta(): PaletaMapa {
  return {
    fondo: leerToken('--card'),
    lienzo: leerToken('--map-fondo'),
    contorno: leerToken('--primary'),
    borde: leerToken('--card'),
    seleccion: leerToken('--accent'),
    sinDatos: leerToken(NIVELES.SIN_DATOS.mapaToken),
    sinDatosTrazo: leerToken('--map-sin-datos-trazo'),
    estacion: leerToken('--accent'),
    estacionBorde: leerToken('--primary'),
    agua: leerToken('--map-agua'),
    aguaBrillo: leerToken('--map-agua-brillo'),
    parque: leerToken('--map-parque'),
    calle: leerToken('--map-calle'),
    calleBorde: leerToken('--map-calle-borde'),
    edificio: leerToken('--map-edificio'),
    texto: leerToken('--map-texto'),
    niveles: {
      MUY_BAJA: leerToken(NIVELES.MUY_BAJA.mapaToken),
      BAJA: leerToken(NIVELES.BAJA.mapaToken),
      MEDIA: leerToken(NIVELES.MEDIA.mapaToken),
      ALTA: leerToken(NIVELES.ALTA.mapaToken),
    },
  }
}

export const CAPA_ETIQUETAS = 'etiquetas'
export const CENTRO_INICIAL: [number, number] = [-99.13, 19.43]
export const ZOOM_INICIAL = 10.5
export const OPACIDAD_RELLENO = 0.65
export const OPACIDAD_BORDE = 1

export const CAPA_AGUA = 'agua'

export function getEstiloMapa(paleta: PaletaMapa): StyleSpecification {
  const anchoCalle = (base: number): ExpressionSpecification =>
    porZoom(9, base * 0.2, 13, base, 16, base * 3)

  return {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: {
      mapa: {
        type: 'vector',
        url: 'https://tiles.openfreemap.org/planet',
        attribution: 'OpenFreeMap © OpenMapTiles, datos de OpenStreetMap',
      },
    },
    layers: [
      {
        id: 'fondo',
        type: 'background',
        paint: { 'background-color': paleta.lienzo },
      },
      {
        id: 'parques',
        type: 'fill',
        source: 'mapa',
        'source-layer': 'landcover',
        filter: ['in', 'class', 'grass', 'wood', 'farmland'],
        paint: { 'fill-color': paleta.parque, 'fill-opacity': 0.8 },
      },
      {
        id: 'parques-urbanos',
        type: 'fill',
        source: 'mapa',
        'source-layer': 'park',
        paint: { 'fill-color': paleta.parque },
      },
      {
        id: CAPA_AGUA,
        type: 'fill',
        source: 'mapa',
        'source-layer': 'water',
        paint: { 'fill-color': paleta.agua },
      },
      {
        id: 'rios',
        type: 'line',
        source: 'mapa',
        'source-layer': 'waterway',
        paint: { 'line-color': paleta.agua, 'line-width': anchoCalle(1.5) },
      },
      {
        id: 'edificios',
        type: 'fill',
        source: 'mapa',
        'source-layer': 'building',
        minzoom: 14,
        paint: { 'fill-color': paleta.edificio, 'fill-opacity': 0.85 },
      },
      {
        id: 'calles-borde',
        type: 'line',
        source: 'mapa',
        'source-layer': 'transportation',
        filter: [
          'in',
          'class',
          'motorway',
          'trunk',
          'primary',
          'secondary',
          'tertiary',
          'minor',
          'service',
        ],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': paleta.calleBorde,
          'line-width': anchoCalle(2.6),
        },
      },
      {
        id: 'calles',
        type: 'line',
        source: 'mapa',
        'source-layer': 'transportation',
        filter: [
          'in',
          'class',
          'motorway',
          'trunk',
          'primary',
          'secondary',
          'tertiary',
          'minor',
          'service',
        ],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': paleta.calle, 'line-width': anchoCalle(1.8) },
      },
      {
        id: CAPA_ETIQUETAS,
        type: 'symbol',
        source: 'mapa',
        'source-layer': 'place',
        filter: ['in', 'class', 'city', 'town', 'suburb', 'neighbourhood'],
        layout: {
          'text-field': ['coalesce', ['get', 'name:es'], ['get', 'name']],
          'text-font': ['Noto Sans Bold'],
          'text-size': porZoom(9, 11, 14, 15),
          'text-letter-spacing': 0.04,
        },
        paint: {
          'text-color': paleta.texto,
          'text-halo-color': paleta.calle,
          'text-halo-width': 1.6,
        },
      },
    ],
  }
}

export function expresionRelleno(paleta: PaletaMapa): ExpressionSpecification {
  return [
    'match',
    ['get', 'nivel'],
    'MUY_BAJA',
    paleta.niveles.MUY_BAJA,
    'BAJA',
    paleta.niveles.BAJA,
    'MEDIA',
    paleta.niveles.MEDIA,
    'ALTA',
    paleta.niveles.ALTA,
    paleta.sinDatos,
  ]
}

export const FILTRO_SIN_DATOS: ExpressionSpecification = [
  'any',
  ['!=', ['get', 'disponible'], true],
  ['==', ['get', 'nivel'], null],
]

export function crearPatronSinDatos(paleta: PaletaMapa) {
  const lado = 8
  const lienzo = document.createElement('canvas')
  lienzo.width = lado
  lienzo.height = lado
  const ctx = lienzo.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = paleta.sinDatos
  ctx.fillRect(0, 0, lado, lado)
  ctx.strokeStyle = paleta.sinDatosTrazo
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, lado)
  ctx.lineTo(lado, 0)
  ctx.moveTo(-1, 1)
  ctx.lineTo(1, -1)
  ctx.moveTo(lado - 1, lado + 1)
  ctx.lineTo(lado + 1, lado - 1)
  ctx.stroke()
  return ctx.getImageData(0, 0, lado, lado)
}

function porZoom(...pares: number[]): ExpressionSpecification {
  return ['interpolate', ['linear'], ['zoom'], ...pares]
}

export const ANCHO_BORDE = porZoom(8, 0.5, 11, 1.1, 14, 2.2)
export const RADIO_ESTACION = porZoom(8, 2.5, 12, 4, 15, 7)
export const RADIO_HALO_ESTACION = porZoom(8, 6, 12, 10, 15, 16)
