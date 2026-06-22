import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { SessionUser } from "@/lib/types"
import type { BreadcrumbItem, NavItem } from "@/components/app-shell/app-shell.types"
import { AppShellMobileNav } from "@/components/app-shell/app-shell-mobile-nav"
import { AppShellSidebar } from "@/components/app-shell/app-shell-sidebar"
import { AppShellTopbar } from "@/components/app-shell/app-shell-topbar"

export type { NavItem } from "@/components/app-shell/app-shell.types"

type AppShellProps = {
  brand: string
  title: string
  breadcrumbs: BreadcrumbItem[]
  navItems: NavItem[]
  user: SessionUser
  onLogout: () => void
  children: ReactNode
  topRight?: ReactNode
}

export function AppShell({
  brand,
  breadcrumbs,
  navItems,
  user,
  onLogout,
  children,
  topRight,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const contentPaddingLeft = collapsed ? "lg:pl-[84px]" : "lg:pl-[280px]"

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppShellSidebar
        brand={brand}
        navItems={navItems}
        user={user}
        collapsed={collapsed}
        onLogout={onLogout}
      />

      <div className={cn("lg:transition-[padding-left] lg:duration-200", contentPaddingLeft)}>
        <AppShellTopbar
          breadcrumbs={breadcrumbs}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
          topRight={
            <div className="flex items-center gap-2">
              <AppShellMobileNav brand={brand} navItems={navItems} onLogout={onLogout} />
              {topRight}
            </div>
          }
        />

        <main className="min-h-[calc(100dvh-3.5rem)] px-4 py-5 md:px-6">
          {children}
        </main>
      </div>
    </div>
  )
}
