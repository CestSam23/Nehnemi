import type { Indicador, NivelIndicador } from '@/api/types'

export type NivelVisual = NivelIndicador | 'SIN_DATOS'

export type NivelConfig = {
  etiqueta: string
  token: 'coral' | 'warning' | 'info' | 'success' | 'muted-foreground'
  badge: string
  punto: string
  barra: string
  mapa: string
  mapaToken: string
}

export const NIVELES: Record<NivelVisual, NivelConfig> = {
  MUY_BAJA: {
    etiqueta: 'Muy baja',
    token: 'coral',
    badge: 'border-coral/40 bg-coral/15 text-foreground',
    punto: 'bg-coral',
    barra: 'bg-coral',
    mapa: 'bg-map-muy-baja',
    mapaToken: '--map-muy-baja',
  },
  BAJA: {
    etiqueta: 'Baja',
    token: 'warning',
    badge: 'border-warning/50 bg-warning/15 text-foreground',
    punto: 'bg-warning',
    barra: 'bg-warning',
    mapa: 'bg-map-baja',
    mapaToken: '--map-baja',
  },
  MEDIA: {
    etiqueta: 'Media',
    token: 'info',
    badge: 'border-info/40 bg-info/15 text-foreground',
    punto: 'bg-info',
    barra: 'bg-info',
    mapa: 'bg-map-media',
    mapaToken: '--map-media',
  },
  ALTA: {
    etiqueta: 'Alta',
    token: 'success',
    badge: 'border-success/40 bg-success/15 text-foreground',
    punto: 'bg-success',
    barra: 'bg-success',
    mapa: 'bg-map-alta',
    mapaToken: '--map-alta',
  },
  SIN_DATOS: {
    etiqueta: 'Sin datos',
    token: 'muted-foreground',
    badge:
      'border-dashed border-muted-foreground/50 bg-muted text-muted-foreground',
    punto: 'border border-dashed border-muted-foreground bg-transparent',
    barra: 'bg-muted',
    mapa: 'bg-map-sin-datos',
    mapaToken: '--map-sin-datos',
  },
}

export function nivelVisual(
  indicador: Pick<Indicador, 'disponible' | 'nivel'>,
): NivelVisual {
  if (!indicador.disponible || indicador.nivel === null) return 'SIN_DATOS'
  return indicador.nivel
}
