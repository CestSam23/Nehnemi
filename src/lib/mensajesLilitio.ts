import type { EstadoLititio } from '@/components/brand/Lititio'

export type EstadoLilitio = 'happy' | 'curious' | 'resting'

export type MensajeLilitio = {
  estado: EstadoLilitio
  mensaje: string
}

export type DatosLilitio = {
  dimensionesDisponibles?: Record<string, boolean>
  recomendacion?: string
  nivelInfraestructura?: string
  rol?: string
}

export type PantallaLilitio =
  'panorama' | 'mapa' | 'zona' | 'solicitudes' | 'metodologia'

export const ESTADOS_LITITIO: Record<EstadoLilitio, EstadoLititio> = {
  happy: 'Happy',
  curious: 'Curious',
  resting: 'Resting',
}

export const MENSAJES_LILITIO = {
  panorama: {
    estado: 'happy',
    mensaje:
      '¡Bienvenido! Aquí tienes el pulso de la electromovilidad en CDMX. Explora las dimensiones para ver cómo va cada zona.',
  },
  panoramaSinDimensiones: {
    estado: 'curious',
    mensaje:
      'Adopción y Participación aún no tienen datos suficientes. Se activarán cuando haya más evidencia ciudadana.',
  },
  mapa: {
    estado: 'curious',
    mensaje:
      'Selecciona una dimensión y haz clic en cualquier zona para ver su detalle. Las zonas más oscuras tienen puntuaciones más altas.',
  },
  zonaRecopilarDatos: {
    estado: 'curious',
    mensaje:
      'Esta zona necesita más evidencia. Las solicitudes ciudadanas ayudan a priorizar la instalación de cargadores.',
  },
  zonaInfraestructuraMuyBaja: {
    estado: 'resting',
    mensaje:
      'La infraestructura de carga en esta zona es muy baja. Revisa las señales territoriales para entender por qué.',
  },
  solicitudesAdministrador: {
    estado: 'happy',
    mensaje:
      'Aquí puedes revisar las solicitudes ciudadanas. Como administrador, puedes cambiar su estado.',
  },
  solicitudes: {
    estado: 'happy',
    mensaje: 'Aquí puedes revisar las solicitudes ciudadanas y su estado.',
  },
  metodologia: {
    estado: 'happy',
    mensaje:
      'Aquí se explica cómo calculamos cada indicador. Transparencia ante todo.',
  },
} satisfies Record<string, MensajeLilitio>

export function getPantallaLilitio(ruta: string): PantallaLilitio | null {
  const segmentos = ruta.split('/').filter(Boolean)
  if (segmentos.length === 0) return 'panorama'
  if (segmentos[0] === 'mapa' && segmentos.length === 1) return 'mapa'
  if (segmentos[0] === 'zonas' && segmentos.length === 2) return 'zona'
  if (segmentos[0] === 'solicitudes' && segmentos.length === 1) {
    return 'solicitudes'
  }
  if (segmentos[0] === 'metodologia' && segmentos.length === 1) {
    return 'metodologia'
  }
  return null
}

export function getMensajeLilitio(
  ruta: string,
  datos: DatosLilitio = {},
): MensajeLilitio | null {
  switch (getPantallaLilitio(ruta)) {
    case 'panorama': {
      const dimensiones = datos.dimensionesDisponibles
      if (
        dimensiones &&
        (dimensiones.ADOPCION === false || dimensiones.PARTICIPACION === false)
      ) {
        return MENSAJES_LILITIO.panoramaSinDimensiones
      }
      return MENSAJES_LILITIO.panorama
    }
    case 'mapa':
      return MENSAJES_LILITIO.mapa
    case 'zona':
      if (datos.recomendacion === 'RECOPILAR_MAS_DATOS') {
        return MENSAJES_LILITIO.zonaRecopilarDatos
      }
      if (datos.nivelInfraestructura === 'MUY_BAJA') {
        return MENSAJES_LILITIO.zonaInfraestructuraMuyBaja
      }
      return null
    case 'solicitudes':
      return datos.rol === 'ADMINISTRADOR'
        ? MENSAJES_LILITIO.solicitudesAdministrador
        : MENSAJES_LILITIO.solicitudes
    case 'metodologia':
      return MENSAJES_LILITIO.metodologia
    default:
      return null
  }
}
