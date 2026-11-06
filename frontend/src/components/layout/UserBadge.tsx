import { RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSesion } from '@/features/auth/useSesion'
import { iniciales } from '@/lib/format'
import { ROL_LABELS } from '@/lib/labels'

export function UserBadge() {
  const { data, isPending, isError, isFetching, refetch } = useSesion()

  if (isPending) {
    return (
      <div className="flex items-center gap-6" aria-busy="true">
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="size-9 rounded-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2">
        <p role="alert" className="text-xs text-muted-foreground">
          No se pudo cargar la sesión
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Reintentar"
          loading={isFetching}
          onClick={() => refetch()}
        >
          {!isFetching && <RotateCw />}
        </Button>
      </div>
    )
  }

  const nombre = data.nombre.trim() || 'Usuario'

  return (
    <div className="flex items-center gap-6">
      <div className="hidden flex-col items-end sm:flex">
        <span className="text-xs leading-4 font-medium text-primary">
          {nombre}
        </span>
        <span className="text-[11px] leading-[16.5px] font-medium text-muted-foreground">
          {ROL_LABELS[data.rol]}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-primary shadow-sm"
      >
        {iniciales(nombre)}
      </div>
    </div>
  )
}
