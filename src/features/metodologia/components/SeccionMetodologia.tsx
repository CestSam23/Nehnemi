import type { ReactNode } from 'react'

export function SeccionMetodologia({
  titulo,
  descripcion,
  children,
}: {
  titulo: string
  descripcion: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-2xl leading-8 font-semibold text-primary">
          {titulo}
        </h2>
        <p className="max-w-3xl text-sm font-medium text-muted-foreground">
          {descripcion}
        </p>
      </div>
      {children}
    </section>
  )
}
