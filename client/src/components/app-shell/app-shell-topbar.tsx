import type { ReactNode } from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AppShellBreadcrumbs } from "@/components/app-shell/app-shell-breadcrumbs"
import type { BreadcrumbItem } from "@/components/app-shell/app-shell.types"

type AppShellTopbarProps = {
  breadcrumbs: BreadcrumbItem[]
  collapsed: boolean
  onToggleSidebar: () => void
  topRight?: ReactNode
}

export function AppShellTopbar({
  breadcrumbs,
  collapsed,
  onToggleSidebar,
  topRight,
}: AppShellTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/80 bg-background/90 px-4 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="hidden text-muted-foreground lg:inline-flex"
        onClick={onToggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        data-testid="collapse-sidebar-btn"
      >
        {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </Button>
      <Separator orientation="vertical" className="hidden h-6 lg:block" />
      <div className="min-w-0 flex-1">
        <AppShellBreadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      {topRight}
    </header>
  )
}
