import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { ConfianzaMuestra } from './components/ConfianzaMuestra'
import { FormulasDimensiones } from './components/FormulasDimensiones'
import { FuentesSkeleton } from './components/FuentesSkeleton'
import { MetodologiaHeader } from './components/MetodologiaHeader'
import { NivelesIndicador } from './components/NivelesIndicador'
import { SeccionMetodologia } from './components/SeccionMetodologia'
import { TablaFuentes } from './components/TablaFuentes'
import { useFuentes } from './useFuentes'

export default function MetodologiaPage() {
  const { data, isPending, isError, refetch, isRefetching } = useFuentes()

  return (
    <div className="flex flex-col gap-8 pb-8">
      <MetodologiaHeader />

      <SeccionMetodologia
        titulo="Cómo se calculan los indicadores"
        descripcion="Cuatro dimensiones independientes de 0 a 100, sin puntuación global. Cada una se calcula con percentil estricto: compara zonas entre sí y no mide suficiencia absoluta. Cuando no hay datos se muestra «Sin evidencia suficiente», nunca 0."
      >
        <FormulasDimensiones />
      </SeccionMetodologia>

      <SeccionMetodologia
        titulo="Niveles"
        descripcion="El nivel de cada dimensión se asigna según su puntuación."
      >
        <NivelesIndicador />
      </SeccionMetodologia>

      <SeccionMetodologia
        titulo="Confianza"
        descripcion="La confianza depende del tamaño de la muestra de participantes que respalda el indicador."
      >
        <ConfianzaMuestra />
      </SeccionMetodologia>

      <SeccionMetodologia
        titulo="Fuentes de datos"
        descripcion="Origen, procedencia y fechas de los datos utilizados."
      >
        {isPending ? (
          <FuentesSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} reintentando={isRefetching} />
        ) : data.length === 0 ? (
          <EmptyState
            titulo="Sin fuentes registradas"
            descripcion="Aún no hay fuentes de datos documentadas."
          />
        ) : (
          <TablaFuentes fuentes={data} />
        )}
      </SeccionMetodologia>
    </div>
  )
}
