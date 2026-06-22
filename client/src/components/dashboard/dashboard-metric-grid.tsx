import type { DashboardResponse } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { MetricCard } from "@/components/dashboard/dashboard-metric-card"

type DashboardMetricGridProps = {
  isLoading: boolean
  metrics?: DashboardResponse["metrics"]
  metricLabels: string[]
  getMetricValues: (metricLabel: string) => number[]
}

export function DashboardMetricGrid({
  isLoading,
  metrics,
  metricLabels,
  getMetricValues,
}: DashboardMetricGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-82.5 rounded-xl" />
          ))
        : null}

      {metrics?.map((metric) => (
        <MetricCard
          key={metric.label}
          metric={metric}
          values={getMetricValues(metric.label)}
          labels={metricLabels}
        />
      ))}
    </div>
  )
}
