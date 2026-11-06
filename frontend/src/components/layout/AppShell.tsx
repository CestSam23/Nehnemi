import { Outlet } from 'react-router'
import { LilitioMensaje } from '@/components/feedback/LilitioMensaje'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { useLilitioMensaje } from '@/hooks/useLilitioMensaje'

export default function AppShell() {
  const lilitio = useLilitioMensaje()

  return (
    <div className="min-h-svh bg-background">
      <Header />
      <Sidebar />
      <main className="min-h-svh px-6 py-16 lg:pl-[calc(16rem+1.5rem)]">
        <div className="w-full max-w-[1440px]">
          <Outlet />
        </div>
      </main>
      {lilitio.mensaje && lilitio.estado && (
        <LilitioMensaje
          estado={lilitio.estado}
          mensaje={lilitio.mensaje}
          visible={lilitio.visible}
          onCerrar={lilitio.cerrar}
        />
      )}
    </div>
  )
}
