import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DIMENSIONES } from '@/lib/enums'
import { DIMENSION_LABELS } from '@/lib/labels'
import { FORMULAS } from '../metodologiaContenido'

export function FormulasDimensiones() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {DIMENSIONES.map((dimension) => (
        <Card key={dimension} className="gap-4">
          <CardHeader>
            <CardTitle className="font-serif text-lg font-semibold">
              {DIMENSION_LABELS[dimension]}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="rounded-md bg-secondary/50 px-3 py-2 text-sm font-semibold text-primary">
              {FORMULAS[dimension].formula}
            </p>
            <p className="text-sm text-muted-foreground">
              {FORMULAS[dimension].nota}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
