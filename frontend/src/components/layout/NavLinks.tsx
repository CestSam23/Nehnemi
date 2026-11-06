import type { ReactNode } from 'react'
import { BookOpen, Inbox } from 'lucide-react'
import { Link, matchPath, useLocation } from 'react-router'
import mapaIcon from '@/assets/nav/mapa.svg'
import panoramaIcon from '@/assets/nav/panorama.svg'
import zonaIcon from '@/assets/nav/zona.svg'
import { cn } from '@/lib/utils'

function IconoMascara({
  src,
  ancho,
  alto,
}: {
  src: string
  ancho: number
  alto: number
}) {
  const imagen = `url("${src.replace(/"/g, '%22')}")`

  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 bg-current"
      style={{
        width: ancho,
        height: alto,
        maskImage: imagen,
        WebkitMaskImage: imagen,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  )
}

type Enlace = {
  to: string
  label: string
  patron: string
  fin: boolean
  icono: ReactNode
}

const enlaces: Enlace[] = [
  {
    to: '/',
    label: 'Panorama',
    patron: '/',
    fin: true,
    icono: <IconoMascara src={panoramaIcon} ancho={15} alto={15} />,
  },
  {
    to: '/mapa',
    label: 'Mapa territorial',
    patron: '/mapa',
    fin: false,
    icono: <IconoMascara src={mapaIcon} ancho={15} alto={15} />,
  },
  {
    to: '/zonas/090050001039A',
    label: 'Detalle de zona',
    patron: '/zonas/*',
    fin: false,
    icono: <IconoMascara src={zonaIcon} ancho={18.3333} alto={14.1667} />,
  },
  {
    to: '/solicitudes',
    label: 'Solicitudes',
    patron: '/solicitudes',
    fin: false,
    icono: <Inbox className="size-[15px] shrink-0" />,
  },
  {
    to: '/metodologia',
    label: 'Metodología',
    patron: '/metodologia',
    fin: false,
    icono: <BookOpen className="size-[15px] shrink-0" />,
  },
]

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation()

  return (
    <div className="flex w-full flex-col">
      <p className="px-6 pt-[5px] pb-2.5 text-[11px] font-medium tracking-[0.55px] text-muted-foreground uppercase">
        Tu espacio
      </p>
      <nav aria-label="Principal" className="flex flex-col gap-1 px-1">
        {enlaces.map(({ to, label, patron, fin, icono }) => {
          const activo = Boolean(
            matchPath({ path: patron, end: fin }, pathname),
          )
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={activo ? 'page' : undefined}
              className={cn(
                'flex min-h-12 min-w-11 items-center gap-4 py-2.5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                activo
                  ? 'rounded-r-[8px] border-l-4 border-primary bg-accent pr-4 pl-5 text-base font-bold text-primary'
                  : 'rounded-[8px] px-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary',
              )}
            >
              {icono}
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
