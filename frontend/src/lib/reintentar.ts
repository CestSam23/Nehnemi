import { ApiError } from '@/api/errors'

export function reintentar(intentos: number, error: Error) {
  if (error instanceof ApiError && error.status < 500) return false
  return intentos < 2
}
