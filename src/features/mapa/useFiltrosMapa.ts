import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import type { DimensionIndicador, ZonasMapaParams } from '@/api/types'
import { DIMENSIONES } from '@/lib/enums'

type TipoMapa = ZonasMapaParams['tipo']

const TIPOS: TipoMapa[] = ['ALCALDIA', 'AGEB']

export function useFiltrosMapa() {
  const [params, setParams] = useSearchParams()

  const dimensionParam = params.get('dimension')
  const tipoParam = params.get('tipo')

  const dimension =
    DIMENSIONES.find((valor) => valor === dimensionParam) ?? 'INFRAESTRUCTURA'
  const tipo = TIPOS.find((valor) => valor === tipoParam) ?? 'ALCALDIA'
  const zona = params.get('zona')
  const estaciones = params.get('estaciones') === '1'

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
    dimension,
    tipo,
    zona,
    estaciones,
    cambiarDimension: (valor: DimensionIndicador) =>
      actualizar({ dimension: valor }),
    cambiarTipo: (valor: TipoMapa) => actualizar({ tipo: valor, zona: null }),
    seleccionarZona: (valor: string | null) => actualizar({ zona: valor }),
    cambiarEstaciones: (valor: boolean) =>
      actualizar({ estaciones: valor ? '1' : null }),
  }
}
