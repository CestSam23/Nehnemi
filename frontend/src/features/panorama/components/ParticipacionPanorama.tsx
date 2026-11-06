import type { EstadoSolicitud, PanoramaRespuesta } from '@/api/types'
import { Card } from '@/components/ui/card'
import { formatearEntero } from '@/lib/format'
import { ESTADO_SOLICITUD_LABELS } from '@/lib/labels'

const ESTADOS: EstadoSolicitud[] = [
  'REGISTRADA',
  'EN_REVISION',
  'ATENDIDA',
  'DESCARTADA',
]

export function ParticipacionPanorama({
  participacion,
  solicitudes,
}: Pick<PanoramaRespuesta, 'participacion' | 'solicitudes'>) {
  return (
    <Card className="gap-4 rounded-lg p-6">
      <h2 className="font-serif text-2xl leading-8 font-semibold text-primary">
        Participación ciudadana
      </h2>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Dato
          etiqueta="Ciudadanos registrados"
          valor={participacion.ciudadanos_registrados}
        />
        <Dato etiqueta="Solicitudes totales" valor={solicitudes.total} />
        {ESTADOS.map((estado) => (
          <Dato
            key={estado}
            etiqueta={ESTADO_SOLICITUD_LABELS[estado]}
            valor={solicitudes.por_estado[estado]}
          />
        ))}
      </dl>
    </Card>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs tracking-wider text-muted-foreground uppercase">
        {etiqueta}
      </dt>
      <dd className="font-serif text-2xl font-semibold text-primary">
        {formatearEntero(valor)}
      </dd>
    </div>
  )
}
