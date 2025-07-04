"use client";

import { Loader2Icon } from "lucide-react";
import { SolarDashboard } from "./dashboard";
import { SolarEnergyDataItem, WeatherData } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchSolarPanelData, fetchWeatherData } from "@/lib/fetch";
import {
  calculateEnergyIndependence,
  calculateEnvironmentalImpact,
  calculateMonthlyData,
} from "./utils";
import { panelsNextMaintenance, totalPanels } from "@/lib/constants";

export function SolarDashboardWrapper() {
  const [solarData, setSolarData] = useState<SolarEnergyDataItem[] | null>(
    null
  );
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, weather] = await Promise.all([
          fetchSolarPanelData(),
          fetchWeatherData(),
        ]);

        setSolarData(data);
        setWeatherData(weather);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !solarData || !weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="size-16 animate-spin" />
      </div>
    );
  }

  const totals = solarData?.reduce(
    (acc, item) => ({
      totalProduction: acc.totalProduction + item.production,
      totalExpenditure: acc.totalExpenditure + item.consumption,
    }),
    { totalProduction: 0, totalExpenditure: 0 }
  );

  const lastSolarDataField = solarData.at(-1);

  const allTimeIndependence = calculateEnergyIndependence(solarData);
  const allTimeImpact = calculateEnvironmentalImpact(solarData);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const lastMonthData = solarData?.filter((item) => {
    return item.date >= thirtyDaysAgo;
  });
  const previousMonthData = solarData?.filter((item) => {
    return item.date >= sixtyDaysAgo && item.date < thirtyDaysAgo;
  });

  const monthlyImpact = calculateEnvironmentalImpact(lastMonthData);
  const previousMonthImpact = calculateEnvironmentalImpact(previousMonthData);
  const monthlyProductionConsumption = calculateMonthlyData(solarData);

  return (
    <SolarDashboard
      firstRowData={{
        allTimeIndependence,
        latestPanelsOnline: lastSolarDataField?.panelsOnline ?? 0,
        totalPanels: totalPanels,
        nextMaintenancePanels: panelsNextMaintenance,
        allTimeCO2EmissionsAvoided: allTimeImpact.co2EmissionsAvoided,
        thisMonthMoneySaved: monthlyImpact.moneySaved,
        previousMonthMoneySaved: previousMonthImpact.moneySaved,
      }}
      secondRowData={{
        monthlyProductionConsumption,
        weather: weatherData,
        totalExpenditure: totals?.totalExpenditure ?? 0,
        totalProduction: totals?.totalProduction ?? 0,
      }}
      thirdRowData={{
        productionConsumption: solarData,
      }}
    />
  );
}
