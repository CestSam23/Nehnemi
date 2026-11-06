import { Lightbulb, Scale } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useSenalesZona } from '../useZona'
import { RecomendacionPanel } from './RecomendacionPanel'

export function RecomendacionZona({ clave }: { clave: string }) {
  const senales = useSenalesZona(clave)
  const descripciones =
    senales.data?.senales.filter((senal) => senal.descripcion) ?? []

  return (
    <Card className="gap-6 rounded-lg p-8 lg:col-span-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs tracking-wider text-muted-foreground uppercase">
            Sistema de soporte decisional
          </p>
          <h2 className="font-serif text-2xl leading-8 font-semibold text-primary">
            Recomendación institucional
          </h2>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
          <Lightbulb className="size-4 text-primary" aria-hidden />
        </span>
      </div>

      <RecomendacionPanel clave={clave} />

      <div className="flex flex-col gap-2">
        <p className="text-xs tracking-wider text-muted-foreground uppercase">
          Señales detectadas
        </p>
        {senales.isPending ? (
          <Skeleton className="h-16 w-full" />
        ) : descripciones.length > 0 ? (
          <ul className="flex flex-col gap-2 rounded-md border bg-card p-4 text-sm text-muted-foreground">
            {descripciones.map((senal) => (
              <li key={senal.codigo}>{senal.descripcion}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin señales registradas para esta zona.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-primary p-5 text-primary-foreground">
        <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-lima-soft uppercase">
          <Scale className="size-4" aria-hidden />
          Criterio institucional
        </div>
        <p className="text-lg tracking-tight">“La decisión final es humana.”</p>
        <p className="text-xs leading-5 text-secondary">
          Este sistema es estrictamente orientador. La asignación presupuestaria
          y despliegue físico corresponden de manera exclusiva al cuerpo técnico
          directivo de SEMOVI y comités vecinales.
        </p>
      </div>

      <Link
        to="/mapa"
        className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
      >
        Volver al mapa territorial
      </Link>
    </Card>
  )
}
