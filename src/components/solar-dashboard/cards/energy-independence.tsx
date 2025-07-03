import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type EnergyIndependenceCardProps = {
  energyIndependence: number;
};

export function EnergyIndependenceCard({
  energyIndependence,
}: EnergyIndependenceCardProps) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription>Energy independence</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {Math.round(energyIndependence)}%
        </CardTitle>
        <div className="text-muted-foreground">
          of energy needs met by solar.
        </div>
      </CardHeader>

      <CardFooter>
        <Progress value={energyIndependence} />
      </CardFooter>
    </Card>
  );
}
