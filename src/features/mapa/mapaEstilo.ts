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
    niveles: {
      MUY_BAJA: leerToken(NIVELES.MUY_BAJA.mapaToken),
      BAJA: leerToken(NIVELES.BAJA.mapaToken),
      MEDIA: leerToken(NIVELES.MEDIA.mapaToken),
      ALTA: leerToken(NIVELES.ALTA.mapaToken),
    },
  }
}

export function crearEstilo(paleta: PaletaMapa): StyleSpecification {
  return {
    version: 8,
    sources: {},
    layers: [
      {
        id: 'fondo',
        type: 'background',
        paint: { 'background-color': paleta.lienzo },
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

export const ANCHO_BORDE = porZoom(8, 0.25, 11, 0.6, 14, 1.4)
export const RADIO_ESTACION = porZoom(8, 2.5, 12, 4, 15, 7)
export const RADIO_HALO_ESTACION = porZoom(8, 6, 12, 10, 15, 16)
