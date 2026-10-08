import { NoDisponible } from '@/features/auth/components/NoDisponible'

const TAB_BASE =
  'flex min-h-12 min-w-11 flex-1 items-center justify-center rounded-[8px] px-4 py-2.5 text-sm tracking-[0.01em]'

export function AccessTabs() {
  return (
    <div
      role="tablist"
      aria-label="Tipo de acceso institucional"
      className="flex w-full items-center rounded-md bg-secondary p-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected="true"
        className={`${TAB_BASE} bg-accent font-bold text-primary shadow-sm`}
      >
        Iniciar sesión
      </button>
      <NoDisponible className="flex flex-1">
        <button
          type="button"
          role="tab"
          aria-selected="false"
          aria-disabled="true"
          tabIndex={-1}
          className={`${TAB_BASE} cursor-not-allowed font-medium text-muted-foreground`}
        >
          Registrarme
        </button>
      </NoDisponible>
    </div>
  )
}
