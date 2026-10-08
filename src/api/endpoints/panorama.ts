import { api } from '@/api/client'
import type { PanoramaRespuesta } from '@/api/types'

export function getPanorama() {
  return api.get<PanoramaRespuesta>('/panorama')
}
