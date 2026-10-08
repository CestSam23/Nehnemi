import { useState } from 'react'
import { useLocation } from 'react-router'
import { useSesion } from '@/features/auth/useSesion'
import { usePanorama } from '@/features/panorama/usePanorama'
import { useRecomendacionesZona, useResumenZona } from '@/features/zona/useZona'
import {
  ESTADOS_LITITIO,
  getMensajeLilitio,
  getPantallaLilitio,
  type DatosLilitio,
} from '@/lib/mensajesLilitio'

const STORAGE_KEY = 'lilitio:mensajes-vistos'

function leerVistos(): string[] {
  try {
    const valor = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(valor) ? valor : []
  } catch {
    return []
  }
}

function guardarVisto(pantalla: string) {
  try {
    const vistos = leerVistos()
    if (!vistos.includes(pantalla)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...vistos, pantalla]))
    }
  } catch {
    return
  }
}

export function useLilitioMensaje() {
  const { pathname } = useLocation()
  const { data: sesion } = useSesion()
  const pantalla = getPantallaLilitio(pathname)
  const clave = pathname.split('/').filter(Boolean)[1] ?? ''
  const [cerradas, setCerradas] = useState<string[]>([])

  const panorama = usePanorama(pantalla === 'panorama')
  const resumen = useResumenZona(clave, pantalla === 'zona')
  const recomendaciones = useRecomendacionesZona(clave, pantalla === 'zona')

  let datos: DatosLilitio = {}
  let listo = true

  if (pantalla === 'panorama') {
    listo = !panorama.isPending
    if (panorama.data) {
      datos = {
        dimensionesDisponibles: Object.fromEntries(
          Object.entries(panorama.data.dimensiones).map(([dimension, d]) => [
            dimension,
            d.disponible,
          ]),
        ),
      }
    }
  } else if (pantalla === 'zona') {
    listo = !resumen.isPending && !recomendaciones.isPending
    datos = {
      recomendacion: recomendaciones.data?.recomendaciones[0]?.accion,
      nivelInfraestructura:
        resumen.data?.indicadores.find((i) => i.dimension === 'INFRAESTRUCTURA')
          ?.nivel ?? undefined,
    }
  } else if (pantalla === 'solicitudes') {
    listo = sesion !== undefined
    datos = { rol: sesion?.rol }
  }

  const contenido = listo ? getMensajeLilitio(pathname, datos) : null
  const clavePantalla = pantalla === 'zona' ? `zona:${clave}` : pantalla
  const visible =
    contenido !== null &&
    pantalla !== null &&
    clavePantalla !== null &&
    !leerVistos().includes(pantalla) &&
    !cerradas.includes(clavePantalla)

  function cerrar() {
    if (!pantalla || !clavePantalla) return
    guardarVisto(pantalla)
    setCerradas((actuales) => [...actuales, clavePantalla])
  }

  return {
    mensaje: contenido?.mensaje ?? null,
    estado: contenido ? ESTADOS_LITITIO[contenido.estado] : null,
    visible,
    cerrar,
  }
}
