import { Palette } from 'lucide-react'
import type { DimensionIndicador, NivelIndicador } from '@/api/types'
import { DIMENSION_LABELS } from '@/lib/labels'
import { NIVELES } from '@/lib/levels'
import { cn } from '@/lib/utils'

const ORDEN: NivelIndicador[] = ['MUY_BAJA', 'BAJA', 'MEDIA', 'ALTA']

export function MapaLeyenda({ dimension }: { dimension: DimensionIndicador }) {
  return (
    <section
      aria-label="Leyenda del mapa"
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-[12px] border border-primary bg-card px-6 py-2.5 shadow-xs"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-primary">
        <Palette className="size-[15px]" aria-hidden />
        <span>Nivel de {DIMENSION_LABELS[dimension].toLowerCase()}:</span>
      </div>
      <ul className="flex flex-wrap items-center gap-6">
        {ORDEN.map((nivel) => (
          <li key={nivel} className="flex items-center gap-2">
            <span
              className={cn(
                'size-4 rounded-sm shadow-inner',
                NIVELES[nivel].mapa,
              )}
            />
            <span className="text-[11px] font-medium text-muted-foreground">
              {NIVELES[nivel].etiqueta}
            </span>
          </li>
        ))}
        <li className="flex items-center gap-2 rounded-sm border border-primary bg-secondary py-1 pr-2 pl-4">
          <span
            className={cn(
              'size-4 rounded-sm bg-[repeating-linear-gradient(135deg,var(--map-sin-datos-trazo)_0_1px,transparent_1px_4px)]',
              NIVELES.SIN_DATOS.mapa,
            )}
          />
          <span className="text-[11px] font-bold text-foreground">
            Sin datos / Suelo de conservación
          </span>
        </li>
      </ul>
    </section>
  )
}
