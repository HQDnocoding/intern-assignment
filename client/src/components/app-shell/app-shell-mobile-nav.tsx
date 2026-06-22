import { LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LogoMark } from "@/components/logo"
import type { NavItem } from "@/components/app-shell/app-shell.types"
import { ShellNav } from "@/components/app-shell/app-shell-nav"

type AppShellMobileNavProps = {
  brand: string
  navItems: NavItem[]
  onLogout: () => void
}

export function AppShellMobileNav({ brand, navItems, onLogout }: AppShellMobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" data-testid="mobile-nav-btn">
          <Menu className="size-4" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-75 p-0">
        <SheetHeader className="border-b border-border/80 px-4 py-3">
          <SheetTitle className="flex items-center gap-3 text-base">
            <LogoMark />
            {brand}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 p-4">
          <ShellNav navItems={navItems} />
          <Button
            type="button"
            onClick={onLogout}
            variant="ghost"
            className="flex w-full items-center justify-start gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            data-testid="drawer-signout-btn"
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
