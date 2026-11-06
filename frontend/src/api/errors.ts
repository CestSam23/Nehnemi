export type ValidationIssue = {
  loc: Array<string | number>
  msg: string
  type: string
}

export type FastApiErrorBody = {
  detail: string | ValidationIssue[]
}

export class ApiError extends Error {
  readonly status: number
  readonly issues: ValidationIssue[]

  constructor(status: number, message: string, issues: ValidationIssue[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

function isValidationIssue(value: unknown): value is ValidationIssue {
  if (typeof value !== 'object' || value === null) return false
  const { loc, msg } = value as { loc?: unknown; msg?: unknown }
  return Array.isArray(loc) && typeof msg === 'string'
}

function describeIssue({ loc, msg }: ValidationIssue) {
  const field = loc.slice(1).join('.')
  return field ? `${field}: ${msg}` : msg
}

export function toApiError(status: number, body: unknown, fallback: string) {
  const detail =
    typeof body === 'object' && body !== null && 'detail' in body
      ? (body as { detail: unknown }).detail
      : undefined

  if (typeof detail === 'string' && detail) {
    return new ApiError(status, detail)
  }

  if (Array.isArray(detail)) {
    const issues = detail.filter(isValidationIssue)
    if (issues.length > 0) {
      return new ApiError(status, issues.map(describeIssue).join('; '), issues)
    }
  }

  return new ApiError(status, fallback)
}
