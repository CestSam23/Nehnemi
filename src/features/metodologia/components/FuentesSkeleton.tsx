import { Skeleton } from '@/components/ui/skeleton'

export function FuentesSkeleton() {
  return (
    <div
      className="flex flex-col gap-2"
      role="status"
      aria-label="Cargando fuentes de datos"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-14 rounded-lg" />
      ))}
    </div>
  )
}
