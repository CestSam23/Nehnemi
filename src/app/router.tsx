import { createBrowserRouter, type RouteObject } from 'react-router'
import RequireAuth from '@/app/RequireAuth'
import AppShell from '@/components/layout/AppShell'
import LoginPage from '@/features/auth/LoginPage'
import MapaPage from '@/features/mapa/MapaPage'
import MetodologiaPage from '@/features/metodologia/MetodologiaPage'
import PanoramaPage from '@/features/panorama/PanoramaPage'
import SolicitudesPage from '@/features/solicitudes/SolicitudesPage'
import ZonaPage from '@/features/zona/ZonaPage'

const rutasDev: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/dev/componentes',
        lazy: async () => ({
          Component: (await import('@/features/dev/ComponentesPage')).default,
        }),
      },
    ]
  : []

export const router = createBrowserRouter([
  ...rutasDev,
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <PanoramaPage /> },
          { path: 'mapa', element: <MapaPage /> },
          { path: 'zonas/:clave', element: <ZonaPage /> },
          { path: 'solicitudes', element: <SolicitudesPage /> },
          { path: 'metodologia', element: <MetodologiaPage /> },
        ],
      },
    ],
  },
])
