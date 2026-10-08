import { Lititio } from '@/components/brand/Lititio'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ErrorState({
  titulo = 'No pudimos cargar la información',
  mensaje,
  onRetry,
  reintentando = false,
  className,
}: {
  titulo?: string
  mensaje?: string
  onRetry?: () => void
  reintentando?: boolean
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-4 px-6 py-10 text-center',
        className,
      )}
    >
      <Lititio estado="Resting" />
      <h2 className="font-serif text-xl font-semibold text-foreground">
        {titulo}
      </h2>
      {mensaje && (
        <p className="max-w-md text-sm text-muted-foreground">{mensaje}</p>
      )}
      {onRetry && (
        <Button variant="outline" loading={reintentando} onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
