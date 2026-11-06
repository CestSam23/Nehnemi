import { Skeleton } from '@/components/ui/skeleton'

export function MapaSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando mapa territorial"
      className="size-full"
    >
      <Skeleton className="size-full rounded-[12px]" />
    </div>
  )
}

export function FichaSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando ficha de zona"
      className="flex flex-col gap-5"
    >
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-28 w-full rounded-[12px]" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-[8px]" />
        ))}
      </div>
      <Skeleton className="h-32 w-full rounded-[12px]" />
    </div>
  )
}
