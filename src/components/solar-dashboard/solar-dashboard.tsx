"use client";

import { useEffect, useMemo, useState } from "react";
import { EnergyIndependenceCard } from "./cards/energy-independence";
import { SolarPanelCardStatus } from "./cards/solar-panel-status";
import { CO2EmissionsCard } from "./cards/co2-emission";
import { MoneySavedCard } from "./cards/money-saved";
import { MonthlyProductionSolarPanelsCard } from "./cards/monthly-production-solar-panels";
import { WeatherCard } from "./cards/weather";
import { NetEnergyBalanceCard } from "./cards/net-energy-balance";
import { ProductionVsConsumptionCard } from "./cards/production-vs-consumption";
import { Loader2Icon } from "lucide-react";
import {
  SolarEnergyDataItem,
  SolarEnergySettings,
  WeatherData,
} from "@/lib/types";
import {
  fetchSolarPanelData,
  fetchSolarPanelSettings,
  fetchWeatherData,
} from "@/lib/fetch";

export function SolarDashboard() {
  const [solarData, setSolarData] = useState<SolarEnergyDataItem[] | null>(
    null
  );
  const [solarSettings, setSolarSettings] =
    useState<SolarEnergySettings | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(solarData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls
        const [data, settings, weather] = await Promise.all([
          fetchSolarPanelData(),
          fetchSolarPanelSettings(),
          fetchWeatherData(),
        ]);

        setSolarData(data);
        setSolarSettings(settings);
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

  const calculateEnergyIndependence = (data: SolarEnergyDataItem[]): number => {
    const totals = data.reduce(
      (acc, item) => ({
        totalConsumption: acc.totalConsumption + item.consumption,
        totalProduction: acc.totalProduction + item.production,
        totalGridSupply: acc.totalGridSupply + item.gridSupply,
      }),
      { totalConsumption: 0, totalProduction: 0, totalGridSupply: 0 }
    );

    // Method 1: Based on how much of consumption is met by production
    // Independence = (Production used for consumption / Total consumption) * 100
    // const productionUsedForConsumption = Math.min(
    //   totals.totalProduction,
    //   totals.totalConsumption
    // );
    // const independenceMethod1 =
    //   totals.totalConsumption > 0
    //     ? (productionUsedForConsumption / totals.totalConsumption) * 100
    //     : 0;

    // Method 2: Based on grid dependency
    // Independence = (1 - Grid Supply / Total consumption) * 100
    const independenceMethod2 =
      totals.totalConsumption > 0
        ? Math.max(
            0,
            (1 - totals.totalGridSupply / totals.totalConsumption) * 100
          )
        : 0;

    // Use Method 2 as it directly relates to grid dependency
    return independenceMethod2;
  };

  const calculateEnvironmentalImpact = (data: SolarEnergyDataItem[]) => {
    const totals = data.reduce(
      (acc, item) => ({
        totalProduction: acc.totalProduction + item.production,
        totalGridSupply: acc.totalGridSupply + item.gridSupply,
        totalFeedIn: acc.totalFeedIn + item.feedIn,
      }),
      { totalProduction: 0, totalGridSupply: 0, totalFeedIn: 0 }
    );

    // CO2 emissions avoided (kg)
    // Swiss electricity grid CO2 intensity: ~0.128 kg CO2/kWh (2023 data)
    const co2IntensityKgPerKWh = 0.128;
    const co2EmissionsAvoided = totals.totalProduction * co2IntensityKgPerKWh;

    // Money saved (CHF)
    // Energy cost: 0.1 CHF per kWh (as specified)
    // Money saved = (Production used for consumption) * rate - (Grid supply) * rate + (Feed-in) * feed-in rate
    const energyCostPerKWh = 0.1;
    const feedInRatePerKWh = 0.08; // Typical Swiss feed-in rate (slightly lower than purchase rate)

    const energyNotFromGrid = totals.totalProduction - totals.totalFeedIn; // Energy used directly from solar
    const moneySavedFromDirectUse = energyNotFromGrid * energyCostPerKWh;
    const moneyEarnedFromFeedIn = totals.totalFeedIn * feedInRatePerKWh;
    const totalMoneySaved = moneySavedFromDirectUse + moneyEarnedFromFeedIn;

    return {
      co2EmissionsAvoided: Math.max(0, co2EmissionsAvoided),
      moneySaved: Math.max(0, totalMoneySaved),
    };
  };

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

  interface MonthlyData {
    month: string;
    production: number;
    expenditure: number;
  }

  /**
   * Calculate monthly production and expenditure for the last 12 months
   */
  const calculateMonthlyData = (
    solarData: SolarEnergyDataItem[]
  ): MonthlyData[] => {
    const now = new Date();
    const monthlyData: MonthlyData[] = [];

    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();

      // Filter data for this specific month
      const monthData = solarData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month;
      });

      // Calculate totals for this month
      const totals = monthData.reduce(
        (acc, item) => ({
          production: acc.production + item.production,
          expenditure: acc.expenditure + item.consumption,
        }),
        { production: 0, expenditure: 0 }
      );

      // Format month name
      const monthName = targetDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      monthlyData.push({
        month: monthName,
        production: Math.round(totals.production * 100) / 100, // Round to 2 decimal places
        expenditure: Math.round(totals.expenditure * 100) / 100,
      });
    }

    return monthlyData;
  };

  if (isLoading || !solarData || !solarSettings || !weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="size-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnergyIndependenceCard
          energyIndependence={Math.round(allTimeIndependence)}
        />

        <SolarPanelCardStatus
          onlinePanels={lastSolarDataField?.panelsOnline ?? 0}
          totalPanels={16}
          nextMaintenance={new Date(2026, 4, 2)}
        />

        <CO2EmissionsCard
          co2Avoided={Math.round(allTimeImpact.co2EmissionsAvoided)}
        />

        <MoneySavedCard
          moneySavedThisMonth={Math.round(monthlyImpact.moneySaved)}
          moneySavedLastMonth={Math.round(previousMonthImpact.moneySaved)}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MonthlyProductionSolarPanelsCard
          data={calculateMonthlyData(solarData ?? [])}
        />

        <div className="flex flex-col gap-4">
          <WeatherCard
            className="flex-1"
            isMock={weatherData.isMock}
            temperature={weatherData.temperature}
            cloudCover={weatherData.cloudCover}
            efficiency={weatherData.efficiency}
            weather={weatherData.weather}
            weatherIcon={weatherData.weatherIcon}
          />

          <NetEnergyBalanceCard
            className="flex-1"
            expenditure={totals?.totalExpenditure ?? 0}
            production={totals?.totalProduction ?? 0}
          />
        </div>
      </div>

      {/* Bottom Row - Production vs Consumption */}
      <ProductionVsConsumptionCard data={solarData} />
    </div>
  );
}
