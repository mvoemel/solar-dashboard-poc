import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

const chartConfig = {
  production: {
    label: "Production",
    color: "var(--chart-2)",
  },
  expenditure: {
    label: "Expenditure",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

type MonthlyProductionSolarPanelsCardProps = {
  data: {
    month: string;
    production: number;
    expenditure: number;
  }[];
};

export function MonthlyProductionSolarPanelsCard({
  data,
}: MonthlyProductionSolarPanelsCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="relative">
        <CardTitle>Monthly Production Solar Panels</CardTitle>
        <CardDescription>Total for the last year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="production"
              fill="var(--color-production)"
              radius={4}
            />
            <Bar
              dataKey="expenditure"
              fill="var(--color-expenditure)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
