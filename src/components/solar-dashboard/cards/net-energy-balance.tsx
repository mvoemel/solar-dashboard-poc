import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SimpleCard } from "./simple-card";
import clsx from "clsx";

type NetEnergyBalanceCardProps = {
  expenditure: number;
  production: number;
  className?: string;
};

export function NetEnergyBalanceCard({
  expenditure,
  production,
  className,
}: NetEnergyBalanceCardProps) {
  const netBalance = Math.round(production - expenditure);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Net Energy Balance</CardTitle>
        <CardDescription>Total for entire lifetime</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span
            className={clsx("text-5xl font-bold tabular-nums", {
              "text-green-500": netBalance >= 0,
              "text-red-500": netBalance < 0,
            })}
          >
            {netBalance} kW/h
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          {netBalance < 0
            ? "Deficiency imported from grid"
            : "surplus exported to grid"}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <SimpleCard
            title="Expenditure"
            content={
              <span className="text-red-500 text-2xl">
                -{" "}
                {new Intl.NumberFormat("de-CH").format(Math.round(expenditure))}{" "}
                kW/h
              </span>
            }
          />
          <SimpleCard
            title="Production"
            content={
              <span className="text-green-500 text-2xl">
                +{" "}
                {new Intl.NumberFormat("de-CH").format(Math.round(production))}{" "}
                kW/h
              </span>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
