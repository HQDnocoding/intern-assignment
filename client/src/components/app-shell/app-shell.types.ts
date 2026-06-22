import type { LucideIcon } from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  active?: boolean
}

export type BreadcrumbItem = {
  label: string
  href?: string
}
