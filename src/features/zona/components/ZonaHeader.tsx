import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'
import type { ResumenZonaRespuesta } from '@/api/types'
import { buttonVariants } from '@/components/ui/button'
import { TIPO_ZONA_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

export function ZonaHeader({ zona }: { zona: ResumenZonaRespuesta }) {
  return (
    <header className="flex flex-col gap-4">
      <nav
        aria-label="Ruta de navegación"
        className="flex flex-wrap items-center gap-2 text-xs font-medium text-primary"
      >
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'h-12 min-w-11 gap-1 rounded-md px-3 text-xs font-medium',
          )}
        >
          <ChevronLeft aria-hidden />
          Tu espacio
        </Link>
        <span className="text-base text-muted-foreground">/</span>
        <Link to="/mapa" className="underline-offset-4 hover:underline">
          Mapa territorial
        </Link>
        <span className="text-base text-muted-foreground">/</span>
        <span aria-current="page" className="tracking-wide">
          {zona.clave}
        </span>
      </nav>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-sm bg-secondary px-2 py-0.5 tracking-wider uppercase">
            {TIPO_ZONA_LABELS[zona.tipo]}
          </span>
        </div>
        <h1 className="font-serif text-4xl leading-10 tracking-tight text-primary">
          {zona.nombre}
        </h1>
        <p className="text-base text-muted-foreground">
          Diagnóstico multidimensional y plan de recomendación técnica
          territorial
        </p>
      </div>
    </header>
  )
}
