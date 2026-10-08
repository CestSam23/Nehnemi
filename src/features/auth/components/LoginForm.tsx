import { useId, useState, type FormEvent } from 'react'
import { InlineAlert } from '@/components/feedback/InlineAlert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AccessTabs } from '@/features/auth/components/AccessTabs'
import { NoDisponible } from '@/features/auth/components/NoDisponible'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import {
  describirErrorLogin,
  useIniciarSesion,
} from '@/features/auth/useIniciarSesion'

export function LoginForm() {
  const id = useId()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const { mutate, isPending, error } = useIniciarSesion()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate({ correo: correo.trim(), contrasena })
  }

  const alerta = error ? describirErrorLogin(error) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-6">
        <AccessTabs />
      </div>
      {alerta && (
        <div className="pb-6">
          <InlineAlert titulo={alerta.titulo} mensaje={alerta.mensaje} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-correo`}>Correo institucional</Label>
          <Input
            id={`${id}-correo`}
            type="email"
            name="correo"
            autoComplete="username"
            required
            disabled={isPending}
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-contrasena`}>Contraseña</Label>
          <PasswordInput
            id={`${id}-contrasena`}
            name="contrasena"
            autoComplete="current-password"
            required
            disabled={isPending}
            value={contrasena}
            onChange={(event) => setContrasena(event.target.value)}
          />
        </div>
        <div className="flex justify-end pt-1">
          <NoDisponible className="flex min-h-12 min-w-11 items-center">
            <span
              aria-disabled="true"
              className="cursor-not-allowed text-sm font-medium text-primary underline"
            >
              ¿Olvidaste tu contraseña ?
            </span>
          </NoDisponible>
        </div>
        <div className="pt-1">
          <Button type="submit" className="w-full" loading={isPending}>
            Entrar
          </Button>
        </div>
      </form>
      <div aria-hidden="true" className="h-[49px] py-6">
        <div className="h-px bg-input" />
      </div>
    </div>
  )
}
