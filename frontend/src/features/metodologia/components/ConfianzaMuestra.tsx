import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CONFIANZA_LABELS } from '@/lib/labels'
import { UMBRALES_CONFIANZA } from '../metodologiaContenido'

export function ConfianzaMuestra() {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg p-0">
      <ul className="divide-y">
        {UMBRALES_CONFIANZA.map(({ nivel, rango }) => (
          <li
            key={nivel}
            className="flex items-center justify-between gap-4 px-6 py-4"
          >
            <Badge variant="outline">{CONFIANZA_LABELS[nivel]}</Badge>
            <span className="text-sm text-muted-foreground">{rango}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
