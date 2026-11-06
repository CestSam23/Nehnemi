import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/api/errors'
import { iniciarSesion } from '@/api/endpoints/auth'
import { queryKeys } from '@/api/queryKeys'

export function useIniciarSesion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: iniciarSesion,
    onSuccess: (usuario) => {
      queryClient.setQueryData(queryKeys.sesion, usuario)
    },
  })
}

export function describirErrorLogin(error: Error) {
  if (error instanceof ApiError && error.status === 401) {
    return {
      titulo: 'Acceso no autorizado',
      mensaje:
        'Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.',
    }
  }
  return {
    titulo: 'No pudimos iniciar sesión',
    mensaje:
      'Ocurrió un problema al conectar con el servidor. Inténtalo de nuevo.',
  }
}
