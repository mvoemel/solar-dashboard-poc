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
import { WeatherData } from "@/lib/types";

type WeatherCardProps = {
  weather: WeatherData;
  className?: string;
};

export function WeatherCard({ weather, className }: WeatherCardProps) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <CardDescription>Impact on efficiency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <SimpleCard
            title={weather.weather}
            content={
              <Image
                src={`https://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
                alt={weather.weather}
                width={100}
                height={100}
                className="size-8 rounded-lg bg-muted-foreground"
              />
            }
          />
          <SimpleCard
            title={`${weather.temperature}°C`}
            content={<ThermometerIcon className="size-8" />}
          />
          <SimpleCard
            title="Cloud Cover"
            content={<p>{Math.round(weather.cloudCover * 100)}%</p>}
          />
          <SimpleCard
            title="Efficiency"
            content={
              <p
                className={clsx({
                  "text-red-500": weather.efficiency <= 25,
                  "text-yellow-500":
                    weather.efficiency > 25 && weather.efficiency <= 50,
                  "text-lime-500":
                    weather.efficiency > 50 && weather.efficiency <= 75,
                  "text-green-500":
                    weather.efficiency > 75 && weather.efficiency <= 100,
                })}
              >
                {weather.efficiency}%
              </p>
            }
          />
        </div>

        {weather.isMock && (
          <Badge className="absolute top-2 right-2">Mock Data</Badge>
        )}
      </CardContent>
    </Card>
  );
}
