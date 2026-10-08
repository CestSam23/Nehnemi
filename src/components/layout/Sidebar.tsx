import { NavLinks } from '@/components/layout/NavLinks'

export function Sidebar() {
  return (
    <aside className="fixed top-16 bottom-0 left-0 z-20 hidden w-64 border-r bg-card py-6 lg:block">
      <NavLinks />
    </aside>
  )
}
