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

  // Transform the data
  const transformedData = parseResult.data.map((row, index) => {
    try {
      // Parse date and time
      const dateStr = row.tag?.toString().trim();
      const timeStr = row.zeit?.toString().trim();

      if (!dateStr || !timeStr) {
        console.warn(`Missing date or time data at row ${index + 1}`);
        return null;
      }

      //   console.log("Original dateStr:", dateStr);
      //   console.log("Original timeStr:", timeStr);

      const [year, month, day] = dateStr.split("-");
      const [hours, minutes] = timeStr.split(":");

      //   console.log("Parsed values:", { day, month, year, hours, minutes });

      // Make sure all values are what you expect
      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
      //   console.log(date);

      // Extract energy values with fallback to 0
      const consumption = parseFloat(row.verbrauch_haushalt) || 0;
      const production = parseFloat(row.produktion_solar) || 0;
      const panelsOnline = parseInt(row.panels_online) || 0;

      // Calculate feed-in and grid supply
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

/**
 * Reads a CSV file and parses solar energy data
 */
// export async function readSolarEnergyCSV(
//   file: File
// ): Promise<SolarEnergyDataItem[]> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       try {
//         const csvContent = event.target?.result;
//         const parsedData = parseSolarEnergyData(csvContent as string);
//         resolve(parsedData);
//       } catch (error) {
//         reject(error);
//       }
//     };

//     reader.onerror = () => {
//       reject(new Error("Failed to read file"));
//     };

//     reader.readAsText(file);
//   });
// }
