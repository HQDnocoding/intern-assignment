import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SessionUser } from "@/lib/types"
import { cn } from "@/lib/utils"

type AppShellAccountMenuProps = {
  user: SessionUser
  collapsed?: boolean
  onLogout: () => void
  testId?: string
}

export function AppShellAccountMenu({
  user,
  collapsed = false,
  onLogout,
  testId = "account-menu-btn",
}: AppShellAccountMenuProps) {
  const initials = (user.name ?? user.email)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center gap-3 py-2 text-left hover:bg-accent/70",
            collapsed ? "justify-center px-0" : "px-2",
          )}
          data-testid={testId}
        >
          <Avatar className="size-9">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? user.email} />
            <AvatarFallback>{initials || "A"}</AvatarFallback>
          </Avatar>
          <div className={cn("min-w-0 flex-1", collapsed && "hidden")}>
            <div className="truncate text-sm font-medium">{user.name ?? "Personal"}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Signed in as {user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} data-testid="sidebar-signout-btn">
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
