import { Button } from '@/components/ui/button'
import { formatearEntero } from '@/lib/format'

export function Paginacion({
  pagina,
  limite,
  total,
  cargando,
  onCambiar,
}: {
  pagina: number
  limite: number
  total: number
  cargando: boolean
  onCambiar: (pagina: number) => void
}) {
  const paginas = Math.max(1, Math.ceil(total / limite))

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-between gap-4"
    >
      <p className="text-sm font-medium text-muted-foreground">
        Página {formatearEntero(pagina)} de {formatearEntero(paginas)}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={pagina <= 1 || cargando}
          onClick={() => onCambiar(pagina - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          disabled={pagina >= paginas || cargando}
          onClick={() => onCambiar(pagina + 1)}
        >
          Siguiente
        </Button>
      </div>
    </nav>
  )
}
