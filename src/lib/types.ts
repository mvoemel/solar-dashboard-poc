export interface SolarEnergyDataItemCSV {
  tag: string;
  zeit: string;
  verbrauch_haushalt: string;
  produktion_solar: string;
  panels_online: string;
  eigenverbrauch: string;
  einspeisung: string;
  netzbezug: string;
}

export interface SolarEnergyDataItem {
  date: Date;
  consumption: number; // kW / h
  production: number; // kW / h
  panelsOnline: number; // 0 - 16
  feedIn: number; // kW / h
  gridSupply: number; // kW / h
}

export interface WeatherData {
  isMock: boolean;
  temperature: number; // °C
  cloudCover: number; // %
  irradiance: number; // 0 - 1000
  humidity: number; // %
  efficiency: number; // %
  weather: string; // e.g. "Sunny" | "Cloudy" | ...
  weatherIcon: string;
}

export interface MonthlyData {
  month: string;
  production: number;
  expenditure: number;
}
