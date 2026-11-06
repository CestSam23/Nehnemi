import type { ReactNode } from 'react'
import { NoEvidence } from '@/components/feedback/NoEvidence'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SeccionPanorama({
  titulo,
  descripcion,
  motivo,
  encabezadoDerecha,
  className,
  children,
}: {
  titulo: string
  descripcion: string
  motivo?: string
  encabezadoDerecha?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <Card className={cn('gap-4 rounded-lg p-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl leading-8 font-semibold text-primary">
            {titulo}
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            {descripcion}
          </p>
        </div>
        {encabezadoDerecha}
      </div>
      {children ?? <NoEvidence motivo={motivo} />}
    </Card>
  )
}
