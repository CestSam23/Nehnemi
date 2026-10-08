import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import type { EstadoSolicitud } from '@/api/types'

export const ESTADOS_SOLICITUD: EstadoSolicitud[] = [
  'REGISTRADA',
  'EN_REVISION',
  'ATENDIDA',
  'DESCARTADA',
]

export const LIMITE_SOLICITUDES = 20

export function useFiltrosSolicitudes() {
  const [params, setParams] = useSearchParams()

  const estado =
    ESTADOS_SOLICITUD.find((valor) => valor === params.get('estado')) ?? null
  const zona = params.get('zona')?.trim() || null
  const paginaParam = Number(params.get('pagina'))
  const pagina =
    Number.isInteger(paginaParam) && paginaParam >= 1 ? paginaParam : 1

  const actualizar = useCallback(
    (cambios: Record<string, string | null>) => {
      setParams(
        (previos) => {
          const siguientes = new URLSearchParams(previos)
          for (const [clave, valor] of Object.entries(cambios)) {
            if (valor === null) siguientes.delete(clave)
            else siguientes.set(clave, valor)
          }
          return siguientes
        },
        { replace: true },
      )
    },
    [setParams],
  )

  return {
    estado,
    zona,
    pagina,
    cambiarEstado: (valor: EstadoSolicitud | null) =>
      actualizar({ estado: valor, pagina: null }),
    cambiarZona: (valor: string | null) =>
      actualizar({ zona: valor, pagina: null }),
    cambiarPagina: (valor: number) =>
      actualizar({ pagina: valor > 1 ? String(valor) : null }),
    limpiar: () => actualizar({ estado: null, zona: null, pagina: null }),
  }
}
