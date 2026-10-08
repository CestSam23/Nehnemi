import alerta from '@/assets/auth/alerta.svg'
import { cn } from '@/lib/utils'

export function InlineAlert({
  titulo,
  mensaje,
  className,
}: {
  titulo: string
  mensaje: string
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-md border border-error-text bg-error-surface p-3.5 text-sm text-error-text',
        className,
      )}
    >
      <img alt="" src={alerta} className="h-[18.667px] w-[16.667px] shrink-0" />
      <div className="flex flex-col">
        <p className="pb-0.5 leading-[17.5px] font-bold tracking-[0.01em]">
          {titulo}
        </p>
        <p className="leading-[19.25px] font-medium">{mensaje}</p>
      </div>
    </div>
  )
}
