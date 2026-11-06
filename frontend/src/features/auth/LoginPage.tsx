import { Navigate } from 'react-router'
import { Logo } from '@/components/brand/Logo'
import { Skeleton } from '@/components/ui/skeleton'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useSesion } from '@/features/auth/useSesion'

function LoginSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

export default function LoginPage() {
  const { data, isPending } = useSesion()

  if (data) return <Navigate to="/" replace />

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-[1248px] flex-col items-center px-4 py-8">
        <header className="flex flex-col items-center pb-6 text-center">
          <div className="pb-2">
            <Logo size="lg" />
          </div>
          <h1 className="pb-1 font-serif text-4xl leading-[44px] font-semibold tracking-[-0.025em] text-primary">
            Entra a tu espacio
          </h1>
          <p className="text-sm leading-5 font-medium text-muted-foreground">
            Portal institucional de monitoreo territorial de electromovilidad
          </p>
        </header>
        <section className="w-full max-w-[480px] rounded-lg border border-border bg-card p-6 shadow-[0_4px_8px_rgba(57,33,79,0.06)] sm:p-10">
          {isPending ? <LoginSkeleton /> : <LoginForm />}
        </section>
      </div>
    </main>
  )
}
