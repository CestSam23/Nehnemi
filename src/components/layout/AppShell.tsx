import { Outlet } from 'react-router'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

export default function AppShell() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <Sidebar />
      <main className="min-h-svh px-6 py-16 lg:pl-[calc(16rem+1.5rem)]">
        <div className="w-full max-w-[1440px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
