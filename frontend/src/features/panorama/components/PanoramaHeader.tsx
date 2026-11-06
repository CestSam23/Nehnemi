import descargarIcon from '@/assets/panorama/descargar.svg'
import filtrosIcon from '@/assets/panorama/filtros.svg'
import { Button } from '@/components/ui/button'

const PROXIMAMENTE = 'Disponible próximamente'

export function PanoramaHeader() {
  return (
    <header className="flex flex-col gap-2">
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-1 text-xs font-semibold tracking-wide text-muted-foreground"
      >
        <span>Tu espacio</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-bold text-primary">
          Panorama
        </span>
      </nav>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-3xl flex-col gap-1">
          <h1 className="font-serif text-5xl leading-14 font-semibold tracking-tight text-primary">
            Panorama de la CDMX
          </h1>
          <p className="font-medium text-muted-foreground">
            Diagnóstico territorial consolidado de cobertura y adopción de
            electromovilidad urbana.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            disabled
            disabledReason={PROXIMAMENTE}
            className="px-5"
          >
            <img src={descargarIcon} alt="" className="size-3" />
            Descargar reporte
          </Button>
          <Button disabled disabledReason={PROXIMAMENTE} className="px-5">
            <img src={filtrosIcon} alt="" className="size-3.5" />
            Filtros territoriales
          </Button>
        </div>
      </div>
    </header>
  )
}
