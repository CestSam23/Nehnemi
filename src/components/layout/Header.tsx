import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { NavLinks } from '@/components/layout/NavLinks'
import { UserBadge } from '@/components/layout/UserBadge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-30 box-content flex h-16 items-center justify-between border-b border-primary bg-card px-6">
      <div className="flex items-center gap-4">
        <Sheet open={menuAbierto} onOpenChange={setMenuAbierto}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 gap-0 bg-card p-0 py-6">
            <SheetTitle className="sr-only">Navegación</SheetTitle>
            <SheetDescription className="sr-only">
              Secciones del centro de control territorial
            </SheetDescription>
            <NavLinks onNavigate={() => setMenuAbierto(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-1">
          <Logo />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            ·
          </span>
          <span className="hidden text-xs text-muted-foreground uppercase sm:inline">
            Centro de control territorial
          </span>
        </div>
      </div>
      <UserBadge />
    </header>
  )
}
