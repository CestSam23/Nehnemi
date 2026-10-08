import { Skeleton } from '@/components/ui/skeleton'

export function PanoramaSkeleton() {
  return (
    <div
      className="flex flex-col gap-8"
      role="status"
      aria-label="Cargando panorama"
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-14 w-96 max-w-full" />
        <Skeleton className="h-6 w-full max-w-3xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[198px] rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[320px] rounded-lg" />
        <Skeleton className="h-[320px] rounded-lg" />
      </div>
      <Skeleton className="h-[240px] rounded-lg" />
    </div>
  )
}
