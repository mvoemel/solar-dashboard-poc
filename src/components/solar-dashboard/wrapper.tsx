"use client";

import { Loader2Icon } from "lucide-react";
import { SolarDashboard } from "./dashboard";
import { SolarEnergyDataItem, WeatherData } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { fetchSolarPanelData, fetchWeatherData } from "@/lib/fetch";
import {
  calculateEnergyIndependence,
  calculateEnvironmentalImpact,
  calculateMonthlyData,
} from "./utils";

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

  const totals = useMemo(
    () =>
      solarData?.reduce(
        (acc, item) => ({
          totalProduction: acc.totalProduction + item.production,
          totalExpenditure: acc.totalExpenditure + item.consumption,
        }),
        { totalProduction: 0, totalExpenditure: 0 }
      ),
    [solarData]
  );

  const lastSolarDataField = useMemo(
    () => solarData?.at(-1) || null,
    [solarData]
  );

  const allTimeIndependence = useMemo(
    () => calculateEnergyIndependence(solarData ?? []),
    [solarData]
  );

  const allTimeImpact = useMemo(
    () => calculateEnvironmentalImpact(solarData ?? []),
    [solarData]
  );

  const last30Days = useMemo(
    () =>
      solarData?.filter((item) => {
        const now = new Date();
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        return item.date >= thirtyDaysAgo;
      }),
    [solarData]
  );
  const monthlyImpact = calculateEnvironmentalImpact(last30Days ?? []);

  // Calculate previous month for comparison
  const now = new Date();
  const previousMonthStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
  const previousMonthEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const previousMonth = useMemo(
    () =>
      solarData?.filter((item) => {
        return item.date >= previousMonthStart && item.date < previousMonthEnd;
      }),
    [solarData]
  );

  const previousMonthImpact = calculateEnvironmentalImpact(previousMonth ?? []);

  if (isLoading || !solarData || !weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="size-16 animate-spin" />
      </div>
    );
  }

  return (
    <SolarDashboard
      firstRowData={{
        allTimeIndependence,
        latestPanelsOnline: lastSolarDataField?.panelsOnline ?? 0,
        totalPanels: 16,
        nextMaintenancePanels: new Date("2025-09-10"),
        allTimeCO2EmissionsAvoided: allTimeImpact.co2EmissionsAvoided,
        thisMonthMoneySaved: monthlyImpact.moneySaved,
        previousMonthMoneySaved: previousMonthImpact.moneySaved,
      }}
      secondRowData={{
        monthlyProductionConsumption: calculateMonthlyData(solarData),
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
