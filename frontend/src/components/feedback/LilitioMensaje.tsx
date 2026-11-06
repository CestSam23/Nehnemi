import { X } from 'lucide-react'
import { motion } from 'motion/react'
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
        'fixed right-4 bottom-4 z-50 flex w-[calc(100%-2rem)] max-w-xl items-center gap-5 rounded-2xl border-2 border-primary bg-card p-5 pr-12 shadow-xl transition duration-500 ease-out sm:right-6 sm:bottom-6 sm:gap-6 sm:p-6 sm:pr-14',
        mostrar
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-95 opacity-0',
      )}
    >
      <motion.div
        className="h-[135px] w-[104px] shrink-0 sm:h-[157px] sm:w-[121px]"
        animate={mostrar ? { y: [0, -8, 0], rotate: [-2, 2, -2] } : { y: 0 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Lititio
          estado={estado}
          className="origin-top-left scale-60 sm:scale-70"
        />
      </motion.div>
      <p className="font-serif text-lg leading-snug font-medium text-card-foreground sm:text-xl">
        {mensaje}
      </p>
      <button
        type="button"
        onClick={onCerrar}
        tabIndex={visible ? 0 : -1}
        aria-label="Cerrar mensaje"
        className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <X className="size-5" />
      </button>
    </div>
  )
}
