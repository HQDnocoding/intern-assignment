import type { DashboardResponse } from "@/lib/types"
import { dashboardCopy } from "@/lib/copy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/dashboard/dashboard-line-chart"
import { BarChart } from "@/components/dashboard/dashboard-bar-chart"

type DashboardOverviewSectionProps = {
  data?: DashboardResponse
}

export function DashboardOverviewSection({ data }: DashboardOverviewSectionProps) {
  return (
    <div className="space-y-4">
      <Card className="border-border/70 bg-[rgba(24,24,24,0.95)]">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-white">
            {dashboardCopy.overview.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">{dashboardCopy.overview.description}</p>
          {data ? <LineChart data={data.timeseries} /> : null}
        </CardContent>
      </Card>

      {data ? <BarChart data={data.timeseries} /> : null}
    </div>
  )
}
