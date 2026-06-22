import { useMemo, useState } from "react"
import { Bar, BarChart as RechartBarChart, CartesianGrid, XAxis } from "recharts"
import type { DashboardResponse } from "@/lib/types"
import { dashboardCopy } from "@/lib/copy"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { barChartConfig, formatDashboardDate } from "@/components/dashboard/dashboard-chart-utils"

type ActiveChart = "performance" | "clickRate"

export function BarChart({ data }: { data: DashboardResponse["timeseries"] }) {
  const [activeChart, setActiveChart] = useState<ActiveChart>("performance")

  const chartData = useMemo(
    () =>
      data.map((item) => {
        const openRate = item.sent ? (item.delivered / item.sent) * 100 : 0
        const clickRate = Math.max(0, openRate * 0.1)
        return {
          name: item.label,
          performance: parseFloat(openRate.toFixed(1)),
          clickRate: parseFloat(clickRate.toFixed(1)),
        }
      }),
    [data],
  )

  if (!chartData.length) return null

  const total = {
    performance: (
      chartData.reduce((acc, curr) => acc + curr.performance, 0) / chartData.length
    ).toFixed(1),
    clickRate: (
      chartData.reduce((acc, curr) => acc + curr.clickRate, 0) / chartData.length
    ).toFixed(1),
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0">
          <CardTitle>{dashboardCopy.charts.performance.title}</CardTitle>
          <CardDescription>{dashboardCopy.charts.performance.description}</CardDescription>
        </div>
        <div className="flex">
          {(["performance", "clickRate"] as ActiveChart[]).map((chart) => (
            <button
              key={chart}
              type="button"
              data-active={activeChart === chart}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-xs text-muted-foreground">
                {chart === "performance"
                  ? dashboardCopy.charts.performance.performanceLabel
                  : dashboardCopy.charts.performance.clickRateLabel}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">{total[chart]}%</span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={barChartConfig} className="aspect-auto h-62.5 w-full">
          <RechartBarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
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
            <Bar
              dataKey={activeChart}
              fill={activeChart === "performance" ? "#2563eb" : "#10b981"}
            />
          </RechartBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
