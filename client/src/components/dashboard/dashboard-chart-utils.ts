import type { ChartConfig } from "@/components/ui/chart"

export const lineChartConfig = {
  marketing: {
    label: "Marketing",
    color: "#2563eb",
  },
  transactional: {
    label: "Transactional",
    color: "#10b981",
  },
} satisfies ChartConfig

export const barChartConfig = {
  performance: {
    label: "Performance",
    color: "#2563eb",
  },
  clickRate: {
    label: "Click Rate",
    color: "#10b981",
  },
} satisfies ChartConfig

export function formatDashboardDate(value: string) {
  return new Date(`${value}, 2024`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
