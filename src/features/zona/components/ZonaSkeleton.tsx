import { Skeleton } from '@/components/ui/skeleton'

export function ZonaSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-label="Cargando detalle de zona"
    >
      <Skeleton className="h-12 w-72 max-w-full" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-[28rem] max-w-full" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-52 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <Skeleton className="h-[520px] rounded-lg lg:col-span-7" />
        <Skeleton className="h-[520px] rounded-lg lg:col-span-5" />
      </div>
    </div>
  )
}
