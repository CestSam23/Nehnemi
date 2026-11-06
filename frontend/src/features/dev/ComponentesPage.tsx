import type { ReactNode } from 'react'
import { Download, Plus } from 'lucide-react'
import type { Indicador, NivelIndicador } from '@/api/types'
import { Lititio, type EstadoLititio } from '@/components/brand/Lititio'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { NoEvidence } from '@/components/feedback/NoEvidence'
import { DimensionBar } from '@/components/indicadores/DimensionBar'
import { DimensionCard } from '@/components/indicadores/DimensionCard'
import { LevelBadge } from '@/components/indicadores/LevelBadge'
import { Button } from '@/components/ui/button'
import { DIMENSIONES } from '@/lib/enums'
import { NIVELES, type NivelVisual } from '@/lib/levels'

const variantes = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
] as const

const tamanos = ['xs', 'sm', 'default', 'lg'] as const

const tamanosIcono = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const

const niveles = Object.keys(NIVELES) as NivelVisual[]

const estadosLititio: EstadoLititio[] = ['Happy', 'Curious', 'Resting']

const barras: { nivel: NivelIndicador; puntuacion: number }[] = [
  { nivel: 'MUY_BAJA', puntuacion: 12.4 },
  { nivel: 'BAJA', puntuacion: 38.75 },
  { nivel: 'MEDIA', puntuacion: 61.2 },
  { nivel: 'ALTA', puntuacion: 94.51 },
]

const conDato: Indicador = {
  dimension: 'INFRAESTRUCTURA',
  disponible: true,
  puntuacion: 94.51,
  nivel: 'ALTA',
  confianza: 'ALTA',
  tamano_muestra: null,
  componentes: null,
  explicacion: 'Cobertura y capacidad de carga por encima de la mediana.',
}

const sinDato: Indicador = {
  dimension: 'ADOPCION',
  disponible: false,
  puntuacion: null,
  nivel: null,
  confianza: null,
  tamano_muestra: null,
  componentes: null,
  explicacion: null,
}

function Seccion({
  titulo,
  children,
}: {
  titulo: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b pb-2 font-serif text-2xl font-semibold">
        {titulo}
      </h2>
      {children}
    </section>
  )
}

function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-bold text-muted-foreground">{titulo}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export default function ComponentesPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl font-semibold">
          Muestrario de componentes
        </h1>
        <p className="text-muted-foreground">Solo disponible en desarrollo.</p>
      </header>

      <Seccion titulo="Button">
        <Grupo titulo="Variantes">
          {variantes.map((variante) => (
            <Button key={variante} variant={variante}>
              {variante}
            </Button>
          ))}
        </Grupo>
        <Grupo titulo="Tamaños">
          {tamanos.map((tamano) => (
            <Button key={tamano} size={tamano}>
              {tamano}
            </Button>
          ))}
        </Grupo>
        <Grupo titulo="Tamaños de icono">
          {tamanosIcono.map((tamano) => (
            <Button key={tamano} size={tamano} aria-label={tamano}>
              <Plus />
            </Button>
          ))}
        </Grupo>
        <Grupo titulo="Con icono">
          <Button>
            <Download />
            Descargar
          </Button>
          <Button variant="outline">
            <Plus />
            Agregar
          </Button>
        </Grupo>
        <Grupo titulo="Disabled">
          {variantes.map((variante) => (
            <Button key={variante} variant={variante} disabled>
              {variante}
            </Button>
          ))}
        </Grupo>
        <Grupo titulo="Disabled con disabledReason (pasa el cursor o enfoca)">
          <Button
            disabled
            disabledReason="Solo el rol Administrador puede cambiar el estado."
          >
            Cambiar estado
          </Button>
          <Button
            variant="outline"
            disabled
            disabledReason="Selecciona una zona para continuar."
          >
            Ver detalle
          </Button>
        </Grupo>
        <Grupo titulo="Loading">
          {variantes.map((variante) => (
            <Button key={variante} variant={variante} loading>
              {variante}
            </Button>
          ))}
        </Grupo>
        <Grupo titulo="Loading con icono de tamaño sm / lg">
          <Button size="sm" loading>
            Guardando
          </Button>
          <Button size="lg" loading>
            Guardando
          </Button>
        </Grupo>
      </Seccion>

      <Seccion titulo="LevelBadge">
        <Grupo titulo="Niveles">
          {niveles.map((nivel) => (
            <LevelBadge key={nivel} nivel={nivel} />
          ))}
        </Grupo>
      </Seccion>

      <Seccion titulo="DimensionBar">
        <div className="grid gap-4 sm:grid-cols-2">
          {barras.map(({ nivel, puntuacion }) => (
            <div key={nivel} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <LevelBadge nivel={nivel} />
                <span className="text-sm text-muted-foreground">
                  {puntuacion}
                </span>
              </div>
              <DimensionBar
                indicador={{ disponible: true, nivel, puntuacion }}
              />
            </div>
          ))}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <LevelBadge nivel="SIN_DATOS" />
            <DimensionBar
              indicador={{ disponible: false, nivel: null, puntuacion: null }}
              motivo="Sin datos territoriales suficientes"
            />
          </div>
        </div>
      </Seccion>

      <Seccion titulo="DimensionCard">
        <div className="grid gap-4 sm:grid-cols-2">
          <DimensionCard indicador={conDato} />
          <DimensionCard
            indicador={sinDato}
            motivo="Sin datos territoriales suficientes"
          />
          {DIMENSIONES.filter(
            (dimension) =>
              dimension !== conDato.dimension &&
              dimension !== sinDato.dimension,
          ).map((dimension, indice) => (
            <DimensionCard
              key={dimension}
              indicador={{
                ...conDato,
                dimension,
                nivel: indice === 0 ? 'BAJA' : 'MEDIA',
                puntuacion: indice === 0 ? 31.8 : 57.3,
                confianza: indice === 0 ? 'MEDIA' : 'BAJA',
                explicacion: null,
              }}
            />
          ))}
        </div>
      </Seccion>

      <Seccion titulo="NoEvidence">
        <div className="grid gap-4 sm:grid-cols-2">
          <NoEvidence />
          <NoEvidence motivo="Sin evidencia ciudadana en esta zona" />
        </div>
      </Seccion>

      <Seccion titulo="EmptyState">
        <div className="grid gap-4 rounded-lg border bg-card sm:grid-cols-2">
          <EmptyState
            titulo="Sin solicitudes"
            descripcion="Esta zona todavía no tiene solicitudes de infraestructura registradas."
          />
          <EmptyState
            titulo="Sin resultados"
            descripcion="Prueba con otros filtros."
            accion={<Button variant="outline">Limpiar filtros</Button>}
          />
        </div>
      </Seccion>

      <Seccion titulo="ErrorState">
        <div className="grid gap-4 rounded-lg border bg-card sm:grid-cols-2">
          <ErrorState mensaje="Revisa tu conexión e inténtalo de nuevo." />
          <ErrorState
            titulo="Sesión expirada"
            mensaje="Vuelve a iniciar sesión para continuar."
            onRetry={() => undefined}
          />
          <ErrorState
            mensaje="Reintentando la carga."
            onRetry={() => undefined}
            reintentando
          />
        </div>
      </Seccion>

      <Seccion titulo="Lititio">
        <div className="flex flex-wrap gap-10">
          {estadosLititio.map((estado) => (
            <div key={estado} className="flex flex-col items-center gap-2">
              <Lititio estado={estado} />
              <span className="text-sm text-muted-foreground">{estado}</span>
            </div>
          ))}
        </div>
      </Seccion>
    </div>
  )
}
