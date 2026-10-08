import type { DimensionIndicador, ZonasMapaParams } from '@/api/types'
import { InlineAlert } from '@/components/feedback/InlineAlert'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DIMENSIONES } from '@/lib/enums'
import { DIMENSION_LABELS } from '@/lib/labels'

type TipoMapa = ZonasMapaParams['tipo']

const TIPOS: { valor: TipoMapa; etiqueta: string }[] = [
  { valor: 'ALCALDIA', etiqueta: 'Alcaldías' },
  { valor: 'AGEB', etiqueta: 'AGEB' },
]

const listaClase =
  'h-auto! gap-1 rounded-[8px] bg-secondary p-1 group-data-[orientation=horizontal]/tabs:h-auto'
const triggerClase =
  'h-auto min-h-12 min-w-11 flex-none rounded-sm px-4 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm'

export function MapaControles({
  dimension,
  onDimension,
  tipo,
  onTipo,
  estaciones,
  onEstaciones,
  errorEstaciones,
}: {
  dimension: DimensionIndicador
  onDimension: (valor: DimensionIndicador) => void
  tipo: TipoMapa
  onTipo: (valor: TipoMapa) => void
  estaciones: boolean
  onEstaciones: (valor: boolean) => void
  errorEstaciones: boolean
}) {
  return (
    <section
      aria-label="Filtros del mapa"
      className="flex flex-col gap-3 rounded-[12px] border bg-card p-4 shadow-xs"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
          Dimensión:
        </span>
        <Tabs
          value={dimension}
          onValueChange={(valor) => onDimension(valor as DimensionIndicador)}
        >
          <TabsList className={listaClase} aria-label="Dimensión de análisis">
            {DIMENSIONES.map((valor) => (
              <TabsTrigger key={valor} value={valor} className={triggerClase}>
                {valor === dimension && (
                  <span className="size-2 rounded-full bg-accent" />
                )}
                {DIMENSION_LABELS[valor]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-12 cursor-pointer items-center gap-2.5 rounded-[12px] border border-primary bg-background px-4">
          <Switch
            checked={estaciones}
            onCheckedChange={onEstaciones}
            className="data-[size=default]:h-6 data-[size=default]:w-10"
          />
          <span className="text-xs font-medium text-foreground">
            Mostrar estaciones
          </span>
          {estaciones && <span className="size-2 rounded-full bg-accent" />}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
            Granularidad:
          </span>
          <Tabs
            value={tipo}
            onValueChange={(valor) => onTipo(valor as TipoMapa)}
          >
            <TabsList
              className={`${listaClase} rounded-[12px]`}
              aria-label="Granularidad"
            >
              {TIPOS.map(({ valor, etiqueta }) => (
                <TabsTrigger
                  key={valor}
                  value={valor}
                  className={`${triggerClase} rounded-[8px] px-3 data-[state=active]:border-primary data-[state=active]:bg-card data-[state=active]:text-primary`}
                >
                  {etiqueta}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      {errorEstaciones && (
        <InlineAlert
          titulo="No pudimos cargar las estaciones"
          mensaje="Desactiva y vuelve a activar la capa para reintentar."
        />
      )}
    </section>
  )
}
