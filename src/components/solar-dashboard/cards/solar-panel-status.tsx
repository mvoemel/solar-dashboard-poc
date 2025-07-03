import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarClockIcon,
  CheckIcon,
  EllipsisIcon,
  XIcon,
} from "lucide-react";

type SolarPanelStatusCardProps = {
  onlinePanels: number;
  totalPanels: number;
  nextMaintenance: Date;
};

export function SolarPanelCardStatus({
  onlinePanels,
  totalPanels,
  nextMaintenance,
}: SolarPanelStatusCardProps) {
  return (
    <>
      <Card>
        <CardHeader className="relative">
          <CardDescription>Status Solar Panels</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {onlinePanels}/{totalPanels}
          </CardTitle>

          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {onlinePanels === totalPanels ? (
                <>
                  <CheckIcon className="text-green-500" />
                  <span>Online</span>
                </>
              ) : onlinePanels > 0 ? (
                <>
                  <EllipsisIcon className="text-yellow-500" />
                  <span>Some offline</span>
                </>
              ) : (
                <>
                  <XIcon className="text-red-500" />
                  <span>Offline</span>
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardFooter className="flex items-center gap-2 text-sm">
          <CalendarClockIcon className="size-5" />
          <p className="text-muted-foreground">
            Next maintenance: {nextMaintenance.toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
