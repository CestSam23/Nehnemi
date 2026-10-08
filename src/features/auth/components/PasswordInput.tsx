import { useState, type ComponentProps } from 'react'
import { Eye } from 'lucide-react'
import ojoOculto from '@/assets/auth/ojo-oculto.svg'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function PasswordInput({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative flex items-center">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-12', className)}
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
        className="absolute top-0 right-3 flex h-12 min-w-11 items-center justify-center rounded-[8px] outline-none focus-visible:outline-2 focus-visible:outline-primary"
      >
        {visible ? (
          <Eye className="h-[16.5px] w-[18.333px] text-muted-foreground" />
        ) : (
          <img
            alt=""
            src={ojoOculto}
            className="h-[16.5px] w-[18.333px] shrink-0"
          />
        )}
      </button>
    </div>
  )
}
