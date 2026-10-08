import { Badge } from '@/components/ui/badge'
import { NIVELES, type NivelVisual } from '@/lib/levels'
import { cn } from '@/lib/utils'

export function LevelBadge({
  nivel,
  className,
}: {
  nivel: NivelVisual
  className?: string
}) {
  const config = NIVELES[nivel]

  return (
    <Badge variant="outline" className={cn(config.badge, className)}>
      <span className={cn('size-2 rounded-full', config.punto)} />
      {config.etiqueta}
    </Badge>
  )
}
