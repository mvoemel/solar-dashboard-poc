"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { DailyAggregatedData, SolarEnergyDataItem } from "@/lib/types";

const chartConfig = {
  signatures: {
    label: "Signatures",
  },
  consumption: {
    label: "Consumption",
    color: "var(--chart-5)",
  },
  production: {
    label: "Production",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type ProductionVsConsumptionCardProps = {
  data: SolarEnergyDataItem[];
  className?: string;
};

export function ProductionVsConsumptionCard({
  data,
  className,
}: ProductionVsConsumptionCardProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("7d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-06-30");
    let daysToSubtract = 365;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "1d") {
      daysToSubtract = 1;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract + 1);
    return date >= startDate;
  });

  const possiblyAggregatedData =
    timeRange === "365d" || timeRange === "30d"
      ? Object.values(
          filteredData.reduce((acc: DailyAggregatedData, item) => {
            const dateKey = item.date.toISOString().split("T")[0]; // Get YYYY-MM-DD format

            if (!acc[dateKey]) {
              acc[dateKey] = {
                date: new Date(dateKey),
                consumption: 0,
                production: 0,
              };
            }

            acc[dateKey].consumption += item.consumption;
            acc[dateKey].production += item.production;

            return acc;
          }, {})
        )
      : filteredData;

  return (
    <Card className={cn(className)}>
      <CardHeader className="relative">
        <CardTitle>Production vs Consumption</CardTitle>
        <CardDescription>
          Total production vs consumption in kW/h
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="md:flex hidden"
          >
            <ToggleGroupItem value="365d" className="h-8 px-2.5">
              Last year
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last month
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last week
            </ToggleGroupItem>
            <ToggleGroupItem value="1d" className="h-8 px-2.5">
              Last day
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="md:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="365d" className="rounded-lg">
                Last year
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last month
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last week
              </SelectItem>
              <SelectItem value="1d" className="rounded-lg">
                Last day
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={possiblyAggregatedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return timeRange === "365d"
                  ? date.toLocaleString("de-CH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : timeRange === "1d"
                  ? date.toLocaleString("de-CH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : date.toLocaleDateString("de-CH", {
                      month: "short",
                      day: "numeric",
                    });
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="consumption"
              type="monotone"
              stroke="var(--color-consumption)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="production"
              type="monotone"
              stroke="var(--color-production)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
