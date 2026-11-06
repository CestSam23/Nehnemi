import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function IndicadorDato({
  icono: Icono,
  valor,
  etiqueta,
  cargando = false,
  className,
}: {
  icono: LucideIcon
  valor: string | null
  etiqueta: string
  cargando?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-md border border-primary bg-card p-4',
        className,
      )}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-card text-primary">
        <Icono className="size-5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        {cargando ? (
          <Skeleton className="h-7 w-20" />
        ) : valor === null ? (
          <p className="text-sm font-bold text-muted-foreground">
            Sin evidencia suficiente
          </p>
        ) : (
          <p className="font-serif text-3xl leading-none font-semibold text-primary">
            {valor}
          </p>
        )}
        <p className="text-xs text-muted-foreground">{etiqueta}</p>
      </div>
    </div>
  )
}
