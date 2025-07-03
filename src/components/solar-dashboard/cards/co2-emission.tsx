import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CO2EmissionsCardProps = {
  co2Avoided: number;
};

const KG_PER_TREE = 25; // TODO: export to constant.ts

export function CO2EmissionsCard({ co2Avoided }: CO2EmissionsCardProps) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription>CO₂ Emissions Avoided all time</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {co2Avoided} kg
        </CardTitle>
      </CardHeader>

      <CardFooter className="flex items-center gap-2 text-sm">
        <p className="text-muted-foreground">
          🌍 Equivalent to {Math.floor(co2Avoided / KG_PER_TREE)} trees
        </p>
      </CardFooter>
    </Card>
  );
}
