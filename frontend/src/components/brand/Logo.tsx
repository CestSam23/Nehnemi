import simboloN from '@/assets/brand/simbolo-n.svg'
import { cn } from '@/lib/utils'

const SIZES = {
  default: {
    root: 'h-[24.7px] gap-[12.35px]',
    symbol: 'h-[24.7px] w-[29.45px]',
    text: 'text-[19.95px] tracking-[3.591px]',
  },
  lg: {
    root: 'h-[32.11px] gap-[16.055px]',
    symbol: 'h-[32.11px] w-[38.285px]',
    text: 'text-[25.94px] tracking-[4.6692px]',
  },
}

export function Logo({
  className,
  size = 'default',
}: {
  className?: string
  size?: keyof typeof SIZES
}) {
  const s = SIZES[size]

  return (
    <div className={cn('flex items-center overflow-clip', s.root, className)}>
      <div className={cn('relative shrink-0', s.symbol)}>
        <div className="absolute inset-[-0.92%_-9.65%_0_-6.42%]">
          <img alt="" className="block size-full max-w-none" src={simboloN} />
        </div>
      </div>
      <span
        className={cn(
          'leading-none font-bold whitespace-nowrap text-primary',
          s.text,
        )}
      >
        NEHNEMI
      </span>
    </div>
  )
}
