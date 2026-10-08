import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/', label: 'Panorama' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/zonas/090050001039A', label: 'Zona' },
  { to: '/solicitudes', label: 'Solicitudes' },
  { to: '/metodologia', label: 'Metodología' },
]

export default function AppShell() {
  return (
    <div className="flex min-h-svh">
      <aside className="border-r p-4">
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
