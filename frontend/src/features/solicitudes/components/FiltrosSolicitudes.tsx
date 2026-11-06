import { useState } from 'react'
import type { EstadoSolicitud } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ESTADO_SOLICITUD_LABEL } from '@/lib/labels'
import { ESTADOS_SOLICITUD } from '../useFiltrosSolicitudes'

const TODOS = 'TODOS'

export function FiltrosSolicitudes({
  estado,
  zona,
  onEstado,
  onZona,
  onLimpiar,
}: {
  estado: EstadoSolicitud | null
  zona: string | null
  onEstado: (valor: EstadoSolicitud | null) => void
  onZona: (valor: string | null) => void
  onLimpiar: () => void
}) {
  const [borrador, setBorrador] = useState(zona ?? '')
  const hayFiltros = estado !== null || zona !== null

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <Select
        value={estado ?? TODOS}
        onValueChange={(valor) =>
          onEstado(valor === TODOS ? null : (valor as EstadoSolicitud))
        }
      >
        <SelectTrigger
          aria-label="Filtrar por estado"
          className="h-12 w-full bg-card md:w-56"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value={TODOS}>Todos los estados</SelectItem>
          {ESTADOS_SOLICITUD.map((valor) => (
            <SelectItem key={valor} value={valor}>
              {ESTADO_SOLICITUD_LABEL[valor]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <form
        className="flex flex-1 gap-2 md:max-w-md"
        onSubmit={(evento) => {
          evento.preventDefault()
          onZona(borrador.trim() || null)
        }}
      >
        <Input
          value={borrador}
          onChange={(evento) => setBorrador(evento.target.value)}
          placeholder="Clave de zona"
          aria-label="Filtrar por clave de zona"
        />
        <Button type="submit" variant="secondary" className="h-12 px-5">
          Buscar
        </Button>
      </form>
      {hayFiltros && (
        <Button
          variant="outline"
          onClick={() => {
            setBorrador('')
            onLimpiar()
          }}
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
