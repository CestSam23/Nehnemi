import type { DimensionIndicador, NivelIndicador } from '@/api/types'
import { DIMENSION_LABELS } from '@/lib/labels'
import { NIVELES } from '@/lib/levels'
import { cn } from '@/lib/utils'

const ORDEN: NivelIndicador[] = ['MUY_BAJA', 'BAJA', 'MEDIA', 'ALTA']

export function MapaLeyenda({ dimension }: { dimension: DimensionIndicador }) {
  return (
    <section
      aria-label="Leyenda del mapa"
      className="pointer-events-none absolute right-6 bottom-6 flex w-56 flex-col gap-2 rounded-md bg-card/90 p-3 shadow-md backdrop-blur-md"
    >
      <p className="text-xs font-semibold text-primary">
        {DIMENSION_LABELS[dimension]}
      </p>
      <div className="flex flex-col gap-1">
        <div className="flex h-2 overflow-hidden rounded-full opacity-65">
          {ORDEN.map((nivel) => (
            <span key={nivel} className={cn('flex-1', NIVELES[nivel].mapa)} />
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>{NIVELES.MUY_BAJA.etiqueta}</span>
          <span>{NIVELES.ALTA.etiqueta}</span>
        </div>
      </div>
      <p className="flex items-center gap-2 border-t pt-2 text-[11px] text-muted-foreground">
        <span
          className={cn(
            'size-3 shrink-0 rounded-sm opacity-65 bg-[repeating-linear-gradient(135deg,var(--map-sin-datos-trazo)_0_1px,transparent_1px_4px)]',
            NIVELES.SIN_DATOS.mapa,
          )}
        />
        Sin datos o suelo de conservación
      </p>
    </section>
  )
}
