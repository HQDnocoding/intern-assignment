import { useEffect, useMemo } from "react"
import { LayoutDashboard } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { dashboardCopy } from "@/lib/copy"
import type { DashboardResponse } from "@/lib/types"
import type { NavItem } from "@/components/app-shell"

export function useDashboardScreen() {
  const params = useParams()
  const orgId = params.orgId

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: dashboardCopy.page.title,
        href: orgId ? `/dashboard/${orgId}` : "/home",
        icon: LayoutDashboard,
        active: true,
      },
    ],
    [orgId],
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ["organization-dashboard", orgId],
    queryFn: async () => {
      const response = await api.get<DashboardResponse>(`/organizations/${orgId}/dashboard`)
      return response.data
    },
    enabled: Boolean(orgId),
  })

  useEffect(() => {
    if (error) {
      toast.error("Could not load dashboard")
    }
  }, [error])

  const metricLabels = useMemo(
    () => data?.timeseries.map((point) => point.label) ?? [],
    [data?.timeseries],
  )

  const getMetricValues = (metricLabel: string) => {
    const points = data?.timeseries ?? []
    return points.map((point, index) => {
      if (metricLabel === "Delivery Rate") {
        return point.sent ? (point.delivered / point.sent) * 100 : 0
      }
      if (metricLabel === "Subscribers") {
        return point.delivered * 1.8 + index * 2
      }
      if (metricLabel === "Bounce Rate") {
        return Math.max(0, point.sent - point.delivered)
      }
      return point.sent
    })
  }

  return {
    orgId,
    navItems,
    data,
    isLoading,
    metricLabels,
    getMetricValues,
  }
}
