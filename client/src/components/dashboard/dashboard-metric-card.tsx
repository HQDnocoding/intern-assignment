import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import type { DashboardResponse } from "@/lib/types"
import { dashboardCopy } from "@/lib/copy"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export function MetricCard({
  metric,
  values,
  labels,
}: {
  metric: DashboardResponse["metrics"][number]
  values: number[]
  labels: string[]
}) {
  const subtitle =
    metric.label === "Emails Sent"
      ? dashboardCopy.metrics.emailsSent.subtitle
      : metric.label === "Delivery Rate"
        ? dashboardCopy.metrics.deliveryRate.subtitle
        : metric.label === "Subscribers"
          ? dashboardCopy.metrics.subscribers.subtitle
          : dashboardCopy.metrics.bounceRate.subtitle

  const chartData = useMemo(() => {
    return labels.map((label, index) => ({
      name: label,
      value: values[index] ?? 0,
    }))
  }, [labels, values])

  const isNegative = metric.change.startsWith("-")
  const strokeColor = isNegative ? "hsl(0, 84%, 60%)" : "hsl(221, 83%, 53%)"

  const chartConfig = {
    value: {
      label: metric.label,
      color: strokeColor,
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{metric.label}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <Badge
            variant={isNegative ? "destructive" : "secondary"}
            className={
              isNegative
                ? "border-transparent bg-transparent px-0 text-[14px] font-semibold text-red-500 hover:bg-transparent"
                : "border-transparent bg-transparent px-0 text-[14px] font-semibold text-emerald-500 hover:bg-transparent"
            }
          >
            {metric.change}
          </Badge>
        </div>
        <div className="text-3xl font-bold">{metric.value}</div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
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
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="value"
              type="natural"
              stroke={strokeColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
