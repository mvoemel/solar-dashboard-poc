import Papa from "papaparse";
import { SolarEnergyDataItem, SolarEnergyDataItemCSV } from "./types";

/**
 * Parses solar energy CSV data and converts it to an array of objects.
 */
export function parseSolarEnergyData(
  csvContent: string
): SolarEnergyDataItem[] {
  // Parse CSV with papaparse
  const parseResult = Papa.parse<SolarEnergyDataItemCSV>(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimiter: ",",
    transformHeader: (header) => header.trim(), // Remove any whitespace from headers
  });

  if (parseResult.errors.length > 0) {
    console.error("CSV parsing errors:", parseResult.errors);
  }

  const transformedData = parseResult.data.map((row, index) => {
    try {
      const dateStr = row.tag?.toString().trim();
      const timeStr = row.zeit?.toString().trim();

      if (!dateStr || !timeStr) {
        console.warn(`Missing date or time data at row ${index + 1}`);
        return null;
      }

      const [year, month, day] = dateStr.split("-");
      const [hours, minutes] = timeStr.split(":");

      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      const consumption = parseFloat(row.verbrauch_haushalt) || 0;
      const production = parseFloat(row.produktion_solar) || 0;
      const panelsOnline = parseInt(row.panels_online) || 0;

      const feedIn = production > consumption ? production - consumption : 0;
      const gridSupply =
        consumption > production ? consumption - production : 0;

      return {
        date,
        consumption,
        production,
        panelsOnline,
        feedIn: Math.round(feedIn * 1000) / 1000, // Round to 3 decimal places
        gridSupply: Math.round(gridSupply * 1000) / 1000, // Round to 3 decimal places
      };
    } catch (error) {
      console.error(`Error processing row ${index + 1}:`, error);
      return null;
    }
  });

  // Filter out any null entries from failed parsing
  return transformedData.filter((item) => item !== null);
}
