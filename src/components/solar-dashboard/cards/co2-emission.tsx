import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { co2kgPerTree } from "@/lib/constants";

type CO2EmissionsCardProps = {
  co2Avoided: number;
};

export function CO2EmissionsCard({ co2Avoided }: CO2EmissionsCardProps) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription>CO₂ Emissions Avoided all time</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {new Intl.NumberFormat("de-CH").format(Math.round(co2Avoided))} kg
        </CardTitle>
      </CardHeader>

      <CardFooter className="flex items-center gap-2 text-sm">
        <p className="text-muted-foreground">
          🌍 Equivalent to {Math.round(co2Avoided / co2kgPerTree)} trees
        </p>
      </CardFooter>
    </Card>
  );
}
