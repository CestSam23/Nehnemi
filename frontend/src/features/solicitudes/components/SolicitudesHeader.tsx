import { StatCard } from '@/components/indicadores/StatCard'
import { formatearEntero } from '@/lib/format'

export function SolicitudesHeader({ total }: { total: number }) {
  return (
    <header className="flex flex-col gap-4">
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-1 text-xs font-semibold tracking-wide text-muted-foreground"
      >
        <span>Tu espacio</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-bold text-primary">
          Solicitudes
        </span>
      </nav>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-3xl flex-col gap-1">
          <h1 className="font-serif text-5xl leading-14 font-semibold tracking-tight text-primary">
            Solicitudes de infraestructura
          </h1>
          <p className="font-medium text-muted-foreground">
            Demanda ciudadana de infraestructura de carga registrada por zona.
          </p>
        </div>
        <StatCard
          className="md:w-64"
          eyebrow="Demanda ciudadana"
          etiqueta="Solicitudes"
          valor={formatearEntero(total)}
        />
      </div>
    </header>
  )
}
