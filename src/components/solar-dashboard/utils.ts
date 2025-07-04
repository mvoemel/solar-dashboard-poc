import {
  co2IntensityKgPerKWh,
  energyCostPerKWh,
  feedInRatePerKWh,
} from "@/lib/constants";
import { MonthlyData, SolarEnergyDataItem } from "@/lib/types";

export const calculateEnergyIndependence = (
  data: SolarEnergyDataItem[]
): number => {
  const totals = data.reduce(
    (acc, item) => ({
      totalConsumption: acc.totalConsumption + item.consumption,
      totalProduction: acc.totalProduction + item.production,
      totalGridSupply: acc.totalGridSupply + item.gridSupply,
    }),
    { totalConsumption: 0, totalProduction: 0, totalGridSupply: 0 }
  );

  // Based on grid dependency
  // Independence = (1 - Grid Supply / Total consumption) * 100
  return totals.totalConsumption > 0
    ? Math.max(0, (1 - totals.totalGridSupply / totals.totalConsumption) * 100)
    : 0;
};

export const calculateEnvironmentalImpact = (data: SolarEnergyDataItem[]) => {
  const totals = data.reduce(
    (acc, item) => ({
      totalProduction: acc.totalProduction + item.production,
      totalGridSupply: acc.totalGridSupply + item.gridSupply,
      totalFeedIn: acc.totalFeedIn + item.feedIn,
    }),
    { totalProduction: 0, totalGridSupply: 0, totalFeedIn: 0 }
  );

  // CO2 emissions avoided (kg)
  const co2EmissionsAvoided = totals.totalProduction * co2IntensityKgPerKWh;

  // Money saved (CHF)
  const energyNotFromGrid = totals.totalProduction - totals.totalFeedIn; // Energy used directly from solar
  const moneySavedFromDirectUse = energyNotFromGrid * energyCostPerKWh;
  const moneyEarnedFromFeedIn = totals.totalFeedIn * feedInRatePerKWh;
  const totalMoneySaved = moneySavedFromDirectUse + moneyEarnedFromFeedIn;

  return {
    co2EmissionsAvoided: Math.max(0, co2EmissionsAvoided),
    moneySaved: Math.max(0, totalMoneySaved),
  };
};

/**
 * Calculate monthly production and expenditure for the last 12 months
 */
export const calculateMonthlyData = (
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
