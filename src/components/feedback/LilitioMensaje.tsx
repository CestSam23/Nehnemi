import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Lititio, type EstadoLititio } from '@/components/brand/Lititio'
import { cn } from '@/lib/utils'

export function LilitioMensaje({
  estado,
  mensaje,
  visible,
  onCerrar,
}: {
  estado: EstadoLititio
  mensaje: string
  visible: boolean
  onCerrar: () => void
}) {
  const [entrado, setEntrado] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrado(visible))
    return () => cancelAnimationFrame(id)
  }, [visible])

  const mostrar = visible && entrado

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className={cn(
        'fixed right-4 bottom-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 pr-10 shadow-lg transition duration-300 ease-out',
        mostrar
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <div className="h-14 w-11 shrink-0">
        <Lititio estado={estado} className="origin-top-left scale-25" />
      </div>
      <p className="text-sm text-card-foreground">{mensaje}</p>
      <button
        type="button"
        onClick={onCerrar}
        tabIndex={visible ? 0 : -1}
        aria-label="Cerrar mensaje"
        className="absolute top-2 right-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
