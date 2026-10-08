export function MetodologiaHeader() {
  return (
    <header className="flex flex-col gap-2">
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-1 text-xs font-semibold tracking-wide text-muted-foreground"
      >
        <span>Tu espacio</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-bold text-primary">
          Metodología
        </span>
      </nav>
      <div className="flex max-w-3xl flex-col gap-1">
        <h1 className="font-serif text-5xl leading-14 font-semibold tracking-tight text-primary">
          Metodología
        </h1>
        <p className="font-medium text-muted-foreground">
          Cómo se calculan los indicadores y de dónde provienen los datos que
          alimentan el diagnóstico territorial.
        </p>
      </div>
    </header>
  )
}
