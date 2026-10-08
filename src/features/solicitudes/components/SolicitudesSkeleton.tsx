import { Skeleton } from '@/components/ui/skeleton'

export function SolicitudesSkeleton() {
  return (
    <div
      className="flex flex-col gap-8"
      role="status"
      aria-label="Cargando solicitudes"
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-14 w-96 max-w-full" />
        <Skeleton className="h-6 w-full max-w-3xl" />
      </div>
      <Skeleton className="h-12 w-full max-w-2xl" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
