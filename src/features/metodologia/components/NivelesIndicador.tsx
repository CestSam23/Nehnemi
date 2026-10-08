import { LevelBadge } from '@/components/indicadores/LevelBadge'
import { Card } from '@/components/ui/card'
import { UMBRALES_NIVEL } from '../metodologiaContenido'

export function NivelesIndicador() {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg p-0">
      <ul className="divide-y">
        {UMBRALES_NIVEL.map(({ nivel, rango }) => (
          <li
            key={nivel}
            className="flex items-center justify-between gap-4 px-6 py-4"
          >
            <LevelBadge nivel={nivel} />
            <span className="text-sm text-muted-foreground">{rango}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
