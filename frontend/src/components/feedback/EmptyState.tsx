import type { ReactNode } from 'react'
import { Lititio } from '@/components/brand/Lititio'
import { cn } from '@/lib/utils'

export function EmptyState({
  titulo,
  descripcion,
  accion,
  className,
}: {
  titulo: string
  descripcion?: string
  accion?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 px-6 py-10 text-center',
        className,
      )}
    >
      <Lititio estado="Curious" />
      <h2 className="font-serif text-xl font-semibold text-foreground">
        {titulo}
      </h2>
      {descripcion && (
        <p className="max-w-md text-sm text-muted-foreground">{descripcion}</p>
      )}
      {accion}
    </div>
  )
}
