import { dashboardCopy } from "@/lib/copy"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import { AppShell } from "@/components/app-shell"
import { DashboardMetricGrid } from "@/components/dashboard/dashboard-metric-grid"
import { DashboardOverviewSection } from "@/components/dashboard/dashboard-overview-section"
import { useDashboardScreen } from "@/hooks/use-dashboard-screen"

export function DashboardScreen() {
  const navigate = useNavigate()
  const { navItems, data, isLoading, metricLabels, getMetricValues } = useDashboardScreen()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)

  return (
    <AppShell
      brand={data?.organization.name ?? "Organization"}
      title={dashboardCopy.page.title}
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: data?.organization.name ?? "Organization" },
        { label: dashboardCopy.page.title },
      ]}
      navItems={navItems}
      user={user!}
      onLogout={() => {
        signOut()
        navigate("/signin", { replace: true })
      }}
    >
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{dashboardCopy.page.title}</h1>
        </div>

        <DashboardMetricGrid
          isLoading={isLoading}
          metrics={data?.metrics}
          metricLabels={metricLabels}
          getMetricValues={getMetricValues}
        />

        <DashboardOverviewSection data={data} />
      </div>
    </AppShell>
  )
}
