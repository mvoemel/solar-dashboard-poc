import { actualOutputPanels, theoreticalMaxPanels } from "./constants";
import { parseSolarEnergyData } from "./parse";
import { SolarEnergyDataItem, WeatherData } from "./types";

export async function fetchSolarPanelData(): Promise<SolarEnergyDataItem[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  try {
    const response = await fetch("/solar_simulation_mock_data.csv");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvContent = await response.text();
    const parsedData = parseSolarEnergyData(csvContent);

    console.log(`Loaded ${parsedData.length} energy data records`);
    return parsedData;
  } catch (error) {
    console.error("Error fetching solar data:", error);
    return [];
  }
}

export async function fetchWeatherData(
  lat: number = 47.3769,
  lon: number = 8.5417,
  maxCapacity: number = theoreticalMaxPanels,
  actualOutput: number = actualOutputPanels
): Promise<WeatherData> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!API_KEY) {
      throw Error("OpenWeatherMap API key not found, using mock data");
    }

    const currentWeatherUrl = `/api/weather/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const currentResponse = await fetch(currentWeatherUrl);

    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    const temperature = Math.round(currentData.main.temp);
    const humidity = currentData.main.humidity;
    const cloudCover = currentData.clouds.all / 100; // % → [0 - 1]
    const visibility = currentData.visibility / 1000; // m → km
    const weather = currentData.weather[0].main; // e.g. "Clear", "Clouds", "Rain"
    const weatherIcon = currentData.weather[0].icon; // e.g. "01d", "02n", "10d"

    // Standard test conditions: 1000 W/m² at 25°C
    let irradiance = 1000; // Start with peak solar irradiance

    // Adjust for cloud cover (major factor)
    if (cloudCover < 0.1) {
      irradiance *= 0.95; // Clear sky, slight atmospheric loss
    } else if (cloudCover < 0.3) {
      irradiance *= 0.85; // Partly cloudy
    } else if (cloudCover < 0.6) {
      irradiance *= 0.65; // Mostly cloudy
    } else if (cloudCover < 0.8) {
      irradiance *= 0.45; // Overcast
    } else {
      irradiance *= 0.25; // Heavy overcast
    }

    // Adjust for time of day (simplified - better would be to use sun elevation angle)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 18) {
      irradiance *= 0.1; // Night/dawn/dusk
    } else if (hour < 8 || hour > 16) {
      irradiance *= 0.7; // Morning/evening
    } else {
      irradiance *= 1.0; // Midday
    }

    // Adjust for atmospheric conditions (visibility/haze)
    const atmosphericFactor = Math.min(visibility / 10, 1); // Normalize visibility
    irradiance *= 0.9 + atmosphericFactor * 0.1;

    const baseIrradianceFactor = irradiance / 1000; // normalize to 1000 W/m² standard
    const temperatureAdjustment =
      temperature > 25 ? 1 - (temperature - 25) * 0.004 : 1; // -0.4% per degree above 25°C
    const cloudCoverImpact = 1 - cloudCover * 0.5; // cloud impact on efficiency
    const atmosphericConditions = 1 - (humidity / 100) * 0.02; // humidity impact

    const expectedOutput =
      maxCapacity *
      baseIrradianceFactor *
      temperatureAdjustment *
      cloudCoverImpact *
      atmosphericConditions;

    const efficiency = Math.round((actualOutput / expectedOutput) * 100);

    return {
      isMock: false,
      temperature,
      cloudCover,
      irradiance: Math.round(irradiance),
      humidity,
      efficiency: Math.max(0, Math.min(100, efficiency)), // Clamp between 0-100%
      weather,
      weatherIcon,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Fall back to mock data if API fails
    return getMockWeatherData();
  }
}

function getMockWeatherData(): WeatherData {
  // Fallback mock data
  const temperature = 32;
  const cloudCover = 0.15;
  const irradiance = 850;
  const humidity = 45;
  const weather = "Sunny";
  const weatherIcon = "01d"; // sunny day icon

  const baseIrradianceFactor = irradiance / 1000; // normalize to 1000 W/m² standard
  const temperatureAdjustment =
    temperature > 25 ? 1 - (temperature - 25) * 0.004 : 1; // -0.4% per degree above 25°C
  const cloudCoverImpact = 1 - cloudCover * 0.5; // cloud impact on efficiency
  const atmosphericConditions = 1 - (humidity / 100) * 0.02; // humidity impact

  const maxCapacity = 5440; // W - theoretical max from solar panels
  const expectedOutput =
    maxCapacity *
    baseIrradianceFactor *
    temperatureAdjustment *
    cloudCoverImpact *
    atmosphericConditions;
  const actualOutput = 3988; // W (this would come from solar panel controller)

  const efficiency = Math.round((actualOutput / expectedOutput) * 100);

  return {
    isMock: true,
    temperature,
    cloudCover,
    irradiance,
    humidity,
    efficiency,
    weather,
    weatherIcon,
  };
}
