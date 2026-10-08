import { ApiError, isApiErrorBody } from '@/api/errors'

const BASE_URL = '/api/v1'

type QueryValue = string | number | boolean | null | undefined

export type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  query?: Record<string, QueryValue>
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = `${BASE_URL}${path}`
  if (!query) return url
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) params.set(key, String(value))
  }
  const search = params.toString()
  return search ? `${url}?${search}` : url
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiFetch<T>(
  path: string,
  { body, query, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await parseBody(response)

  if (!response.ok) {
    if (isApiErrorBody(data)) {
      throw new ApiError(
        response.status,
        data.error.codigo,
        data.error.mensaje,
        data.error.detalles ?? null,
      )
    }
    throw new ApiError(
      response.status,
      'ERROR_DESCONOCIDO',
      response.statusText || 'Error de red',
    )
  }

  return data as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
}
