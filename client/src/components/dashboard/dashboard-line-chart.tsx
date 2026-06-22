import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, Legend, XAxis } from "recharts"
import type { DashboardResponse } from "@/lib/types"
import { dashboardCopy } from "@/lib/copy"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatDashboardDate, lineChartConfig } from "@/components/dashboard/dashboard-chart-utils"

export function LineChart({ data }: { data: DashboardResponse["timeseries"] }) {
  const firstTotal = (data[0]?.marketing ?? 0) + (data[0]?.transactional ?? 0)
  const lastTotal =
    (data[data.length - 1]?.marketing ?? 0) + (data[data.length - 1]?.transactional ?? 0)
  const percentChange = firstTotal
    ? (((lastTotal - firstTotal) / firstTotal) * 100).toFixed(1)
    : 0

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        name: item.label,
        marketing: item.marketing,
        transactional: item.transactional,
      })),
    [data],
  )

  if (!chartData.length) return null

  return (
    <div className="space-y-4">
      <ChartContainer config={lineChartConfig} className="h-65 w-full">
        <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="fillMarketing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="fillTransactional" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="w-37.5"
                labelFormatter={(value) => formatDashboardDate(String(value))}
              />
            }
          />
          <Area
            dataKey="transactional"
            type="natural"
            fill="url(#fillTransactional)"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
          <Area
            dataKey="marketing"
            type="natural"
            fill="url(#fillMarketing)"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
          <Legend />
        </AreaChart>
      </ChartContainer>

      <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 leading-none font-medium">
            {dashboardCopy.charts.line.trendLabel} {percentChange}%
            {dashboardCopy.charts.line.trendSuffix} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            {dashboardCopy.charts.line.periodLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
