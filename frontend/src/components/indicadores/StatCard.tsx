import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  eyebrow,
  etiqueta,
  adorno,
  valor,
  nota,
  className,
}: {
  eyebrow: string
  etiqueta: string
  adorno?: ReactNode
  valor: string
  nota?: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('justify-between gap-4 rounded-lg p-6', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            {etiqueta}
          </p>
        </div>
        {adorno}
      </div>
      <div className="flex flex-wrap items-baseline gap-2 py-4">
        <span className="font-serif text-4xl leading-11 font-semibold tracking-tight text-primary">
          {valor}
        </span>
        {nota}
      </div>
    </Card>
  )
}
