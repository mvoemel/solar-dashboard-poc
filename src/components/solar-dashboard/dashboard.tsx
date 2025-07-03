"use client";

import { EnergyIndependenceCard } from "./cards/energy-independence";
import { SolarPanelCardStatus } from "./cards/solar-panel-status";
import { CO2EmissionsCard } from "./cards/co2-emission";
import { MoneySavedCard } from "./cards/money-saved";
import { MonthlyProductionSolarPanelsCard } from "./cards/monthly-production-solar-panels";
import { WeatherCard } from "./cards/weather";
import { NetEnergyBalanceCard } from "./cards/net-energy-balance";
import { ProductionVsConsumptionCard } from "./cards/production-vs-consumption";
import { MonthlyData, SolarEnergyDataItem, WeatherData } from "@/lib/types";

type SolarDashboardWrapperProps = {
  firstRowData: {
    allTimeIndependence: number;
    latestPanelsOnline: number;
    totalPanels: number;
    nextMaintenancePanels: Date;
    allTimeCO2EmissionsAvoided: number;
    thisMonthMoneySaved: number;
    previousMonthMoneySaved: number;
  };
  secondRowData: {
    monthlyProductionConsumption: MonthlyData[];
    weather: WeatherData;
    totalExpenditure: number;
    totalProduction: number;
  };
  thirdRowData: {
    productionConsumption: SolarEnergyDataItem[];
  };
};

export function SolarDashboard({
  firstRowData,
  secondRowData,
  thirdRowData,
}: SolarDashboardWrapperProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnergyIndependenceCard
          energyIndependence={firstRowData.allTimeIndependence}
        />

        <SolarPanelCardStatus
          onlinePanels={firstRowData.latestPanelsOnline}
          totalPanels={firstRowData.totalPanels}
          nextMaintenance={firstRowData.nextMaintenancePanels}
        />

        <CO2EmissionsCard
          co2Avoided={firstRowData.allTimeCO2EmissionsAvoided}
        />

        <MoneySavedCard
          moneySavedThisMonth={firstRowData.thisMonthMoneySaved}
          moneySavedPreviousMonth={firstRowData.previousMonthMoneySaved}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MonthlyProductionSolarPanelsCard
          data={secondRowData.monthlyProductionConsumption}
        />

        <div className="flex flex-col gap-4">
          <WeatherCard className="flex-1" weather={secondRowData.weather} />

          <NetEnergyBalanceCard
            className="flex-1"
            expenditure={secondRowData.totalExpenditure}
            production={secondRowData.totalProduction}
          />
        </div>
      </div>

      {/* Bottom Row - Production vs Consumption */}
      <ProductionVsConsumptionCard data={thirdRowData.productionConsumption} />
    </div>
  );
}
