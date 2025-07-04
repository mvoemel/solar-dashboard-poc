// Swiss electricity grid CO2 intensity: ~0.128 kg CO2/kWh (2023 data)
export const co2IntensityKgPerKWh = 0.128;

// Energy cost: 0.17 CHF per kWh
// Money saved = (Production used for consumption) * rate - (Grid supply) * rate + (Feed-in) * feed-in rate
export const energyCostPerKWh = 0.17;
export const feedInRatePerKWh = 0.08; // Typical Swiss feed-in rate (slightly lower than purchase rate)

export const co2kgPerTree = 25;

// Mocked data, in an actual implementation you would fetch this from the panel controller
export const totalPanels = 16;
const wattagePerPanel = 350; // W
export const panelsNextMaintenance = new Date("2025-09-10");
export const theoreticalMaxPanels = totalPanels * wattagePerPanel; // W - theoretical max from solar panels
export const actualOutputPanels = 2788; // W
