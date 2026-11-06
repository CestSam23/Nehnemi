import { cn } from '@/lib/utils'

export function NoEvidence({
  motivo,
  className,
}: {
  motivo?: string | null
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-md border border-dashed border-muted-foreground/50 bg-muted px-4 py-3',
        className,
      )}
    >
      <p className="text-sm font-bold text-muted-foreground">
        Sin evidencia suficiente
      </p>
      {motivo && <p className="mt-1 text-xs text-muted-foreground">{motivo}</p>}
    </div>
  )
}
