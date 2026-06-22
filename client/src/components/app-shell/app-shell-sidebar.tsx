import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { LogoMark } from "@/components/logo"
import { AppShellAccountMenu } from "@/components/app-shell/app-shell-account-menu"
import { ShellNav } from "@/components/app-shell/app-shell-nav"
import type { NavItem } from "@/components/app-shell/app-shell.types"
import type { SessionUser } from "@/lib/types"
import { cn } from "@/lib/utils"

type AppShellSidebarProps = {
  brand: string
  navItems: NavItem[]
  user: SessionUser
  collapsed: boolean
  onLogout: () => void
}

export function AppShellSidebar({
  brand,
  navItems,
  user,
  collapsed,
  onLogout,
}: AppShellSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 hidden border-r border-border/80 bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(19,19,19,0.98))] py-3 lg:flex lg:flex-col",
        collapsed ? "lg:w-21 px-3" : "lg:w-70 px-4",
      )}
    >
      <div className={cn("flex items-center pb-3", collapsed ? "justify-center" : "justify-between")}>
        <Link to="/" className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <LogoMark />
          <div className={cn(collapsed && "hidden")}>
            <div className="text-sm font-semibold">{brand}</div>
          </div>
        </Link>
      </div>
      <Separator />

      <div
        className={cn(
          "mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
          collapsed && "sr-only",
        )}
      >
        Application
      </div>
      <div className="mt-2">
        <ShellNav navItems={navItems} collapsed={collapsed} />
      </div>

      <div
        className={cn(
          "mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
          collapsed && "sr-only",
        )}
      >
        Account
      </div>
      <div className="mt-2">
        <AppShellAccountMenu user={user} collapsed={collapsed} onLogout={onLogout} />
      </div>
    </aside>
  )
}
