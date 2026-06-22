import { Link } from "react-router-dom"
import type { NavItem } from "@/components/app-shell/app-shell.types"
import { cn } from "@/lib/utils"

type ShellNavProps = {
  navItems: NavItem[]
  onNavigate?: () => void
  collapsed?: boolean
}

export function ShellNav({ navItems, onNavigate, collapsed = false }: ShellNavProps) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.label}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center rounded-md py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground",
              collapsed ? "justify-center px-0" : "gap-3 px-3",
              item.active && "bg-accent text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span className={cn(collapsed && "hidden")}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
