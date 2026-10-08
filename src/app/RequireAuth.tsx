import { Navigate, Outlet } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useSesion } from '@/features/auth/useSesion'

function SesionSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Verificando sesión"
      className="flex min-h-screen flex-col gap-6 bg-background p-6"
    >
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function RequireAuth() {
  const { data, isPending, isError } = useSesion()

  if (isPending) return <SesionSkeleton />
  if (isError || !data) return <Navigate to="/login" replace />

  return <Outlet />
}
