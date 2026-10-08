import type { VentasEv } from '@/api/types'
import { formatearEntero, formatearPeriodo } from '@/lib/format'

export function VentasEvCard({ ventas }: { ventas: VentasEv }) {
  const serie = ventas.serie_mensual ?? []
  const maximo = serie.reduce((acc, punto) => Math.max(acc, punto.vehiculos), 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-serif text-5xl leading-none font-semibold text-primary">
          {formatearEntero(ventas.ultimo_valor)}
        </p>
        <p className="text-sm text-muted-foreground">
          vehículos eléctricos vendidos en{' '}
          {formatearPeriodo(ventas.ultimo_periodo)} · {ventas.ambito}
        </p>
      </div>

      {serie.length > 0 && maximo > 0 && (
        <div
          className="flex h-24 items-end gap-1"
          role="img"
          aria-label="Ventas mensuales de vehículos eléctricos"
        >
          {serie.map((punto) => (
            <div
              key={punto.periodo}
              title={`${formatearPeriodo(punto.periodo)}: ${formatearEntero(punto.vehiculos)}`}
              className="flex-1 rounded-t-sm bg-primary"
              style={{ height: `${(punto.vehiculos / maximo) * 100}%` }}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {formatearEntero(ventas.periodos_disponibles)} periodos mensuales
        disponibles. Corresponde a ventas registradas, no al parque vehicular.
      </p>
    </div>
  )
}
