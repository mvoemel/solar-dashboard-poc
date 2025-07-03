import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ThermometerIcon } from "lucide-react";
import { SimpleCard } from "./simple-card";
import Image from "next/image";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

type WeatherCardProps = {
  isMock: boolean;
  temperature: number;
  cloudCover: number;
  efficiency: number;
  weather: string;
  weatherIcon: string;
  className?: string;
};

export function WeatherCard({
  isMock,
  temperature,
  cloudCover,
  efficiency,
  weather,
  weatherIcon,
  className,
}: WeatherCardProps) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <CardDescription>Impact on efficiency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <SimpleCard
            title={weather}
            content={
              <Image
                src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                alt={weather}
                width={100}
                height={100}
                className="size-8 rounded-lg bg-muted-foreground"
              />
            }
          />
          <SimpleCard
            title={`${temperature}°C`}
            content={<ThermometerIcon className="size-8" />}
          />
          <SimpleCard
            title="Cloud Cover"
            content={<p>{Math.round(cloudCover * 100)}%</p>}
          />
          <SimpleCard
            title="Efficiency"
            content={
              <p
                className={clsx({
                  "text-red-500": efficiency <= 25,
                  "text-yellow-500": efficiency > 25 && efficiency <= 50,
                  "text-lime-500": efficiency > 50 && efficiency <= 75,
                  "text-green-500": efficiency > 75 && efficiency <= 100,
                })}
              >
                {efficiency}%
              </p>
            }
          />
        </div>

        {isMock && <Badge className="absolute top-2 right-2">Mock Data</Badge>}
      </CardContent>
    </Card>
  );
}
