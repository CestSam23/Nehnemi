export type ApiErrorDetalles = Record<string, unknown> | null

export type ApiErrorBody = {
  error: {
    codigo: string
    mensaje: string
    detalles?: ApiErrorDetalles
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly codigo: string
  readonly detalles: ApiErrorDetalles

  constructor(
    status: number,
    codigo: string,
    mensaje: string,
    detalles: ApiErrorDetalles = null,
  ) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.codigo = codigo
    this.detalles = detalles
  }
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null || !('error' in value)) {
    return false
  }
  const { error } = value as { error: unknown }
  if (typeof error !== 'object' || error === null) return false
  const { codigo, mensaje } = error as { codigo?: unknown; mensaje?: unknown }
  return typeof codigo === 'string' && typeof mensaje === 'string'
}
