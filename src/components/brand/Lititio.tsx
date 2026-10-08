import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import bocaCuriosa from '@/assets/lititio/boca-curiosa.svg'
import mejilla from '@/assets/lititio/mejilla.svg'
import ojo from '@/assets/lititio/ojo.svg'
import ojoEnDescanso from '@/assets/lititio/ojo-en-descanso.svg'
import pie from '@/assets/lititio/pie.svg'
import sonrisa from '@/assets/lititio/sonrisa.svg'
import sonrisaDescanso from '@/assets/lititio/sonrisa-descanso.svg'

export type EstadoLititio = 'Happy' | 'Curious' | 'Resting'

type PiezaProps = {
  src: string
  className: string
}

function Pieza({ src, className }: PiezaProps) {
  return (
    <div className={cn('absolute', className)}>
      <img
        alt=""
        className="absolute inset-0 block size-full max-w-none"
        src={src}
      />
    </div>
  )
}

function PiezaDesbordada({
  src,
  className,
  inset,
}: PiezaProps & { inset: string }) {
  return (
    <div className={cn('absolute', className)}>
      <div className={cn('absolute', inset)}>
        <img alt="" className="block size-full max-w-none" src={src} />
      </div>
    </div>
  )
}

function Ojos({ curioso }: { curioso: boolean }) {
  return (
    <>
      <Pieza
        src={ojo}
        className="top-[110.25px] left-[65.25px] h-[14.25px] w-[10.5px]"
      />
      <Pieza
        src={ojo}
        className={cn(
          'left-[96.75px] h-[14.25px] w-[10.5px]',
          curioso ? 'top-[107.25px]' : 'top-[110.25px]',
        )}
      />
    </>
  )
}

function OjosEnDescanso() {
  return (
    <>
      <PiezaDesbordada
        src={ojoEnDescanso}
        inset="inset-[0_-10.71%_-37.5%_-10.71%]"
        className="top-[119.25px] left-[65.25px] h-[3px] w-[10.5px]"
      />
      <PiezaDesbordada
        src={ojoEnDescanso}
        inset="inset-[0_-10.71%_-37.5%_-10.71%]"
        className="top-[119.25px] left-[96.75px] h-[3px] w-[10.5px]"
      />
    </>
  )
}

function Mejillas() {
  return (
    <>
      <Pieza
        src={mejilla}
        className="top-[135px] left-[47.25px] h-[6.75px] w-[15px]"
      />
      <Pieza
        src={mejilla}
        className="top-[135px] left-[111px] h-[6.75px] w-[15px]"
      />
    </>
  )
}

function Rostro({ estado }: { estado: EstadoLititio }): ReactNode {
  if (estado === 'Resting') {
    return (
      <>
        <OjosEnDescanso />
        <Mejillas />
        <PiezaDesbordada
          src={sonrisaDescanso}
          inset="inset-[0_-9.09%_-25%_-9.09%]"
          className="top-[141.75px] left-[86.25px] h-[6px] w-[16.5px]"
        />
      </>
    )
  }

  if (estado === 'Curious') {
    return (
      <>
        <Ojos curioso />
        <Mejillas />
        <Pieza
          src={bocaCuriosa}
          className="top-[135.75px] left-[90px] size-[9px]"
        />
      </>
    )
  }

  return (
    <>
      <Ojos curioso={false} />
      <Mejillas />
      <PiezaDesbordada
        src={sonrisa}
        inset="inset-[0_-6.9%_-25%_-6.9%]"
        className="top-[141.75px] left-[84px] h-[6px] w-[21.75px]"
      />
    </>
  )
}

export function Lititio({
  estado = 'Happy',
  className,
}: {
  estado?: EstadoLititio
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative h-[225px] w-[172.5px] shrink-0', className)}
    >
      <div className="absolute top-[30.75px] left-[69px] h-[18.75px] w-[34.5px] rounded-t-[7.5px] rounded-b-[2.25px] bg-coral" />
      <div className="absolute top-[47.25px] left-[20.25px] h-[153px] w-[132px] rounded-lg border-[4.5px] border-lima-soft bg-accent" />
      <div className="absolute top-[65.25px] left-[125.25px] h-[24px] w-[9px] rounded-[6px] bg-white/30" />
      <Rostro estado={estado} />
      <div className="absolute top-[167.25px] left-[38.25px] flex h-[13.5px] w-[96px] items-start overflow-clip rounded-[7.5px] bg-primary/14">
        <div className="h-[13.5px] w-[65.28px] shrink-0 bg-coral" />
      </div>
      <Pieza
        src={pie}
        className="top-[192px] left-[30.75px] h-[18.75px] w-[41.25px]"
      />
      <Pieza
        src={pie}
        className="top-[192px] left-[100.5px] h-[18.75px] w-[41.25px]"
      />
    </div>
  )
}
