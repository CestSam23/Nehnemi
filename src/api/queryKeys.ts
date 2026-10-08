import type { SolicitudesParams } from '@/api/types'

export const queryKeys = {
  sesion: ['sesion'] as const,
  panorama: ['panorama'] as const,
  mapa: (tipo: string, dimension: string) => ['mapa', tipo, dimension] as const,
  estaciones: ['estaciones'] as const,
  fuentes: ['fuentes'] as const,
  solicitudes: {
    todas: ['solicitudes'] as const,
    listado: (params: SolicitudesParams) =>
      ['solicitudes', 'listado', params] as const,
  },
  zona: {
    resumen: (clave: string) => ['zona', clave, 'resumen'] as const,
    senales: (clave: string) => ['zona', clave, 'senales'] as const,
    solicitudes: (clave: string) => ['zona', clave, 'solicitudes'] as const,
    recomendaciones: (clave: string) =>
      ['zona', clave, 'recomendaciones'] as const,
  },
}
