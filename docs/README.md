# Solar Dashboard Proof-Of-Concept

A Next.js 15 dashboard for monitoring solar panel energy systems with real-time data visualization and environmental impact tracking. This is a proof of concept and not meant to be used in a real world application.

## Features

- **Energy Independence**: Track percentage of energy needs met by solar
- **Panel Status**: Monitor online/offline panels and maintenance schedules
- **Environmental Impact**: CO₂ emissions avoided and tree equivalency
- **Financial Tracking**: Monthly savings in CHF with trend analysis
- **Weather Integration**: Real-time weather impact on solar efficiency
- **Data Visualization**: Interactive charts for production vs consumption
- **Theme Support**: Light/dark mode toggle

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment setup**

   ```bash
   # .env.local
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

3. **Add your data**

   - Place CSV file in `/public/solar_simulation_mock_data.csv`
   - Update constants in `/src/lib/constants.ts`

4. **Run development server**
   ```bash
   npm run dev
   ```

## CSV Data Format

Required columns:

- `tag`: Date (YYYY-MM-DD)
- `zeit`: Time (HH:MM)
- `verbrauch_haushalt`: Household consumption (kW/h)
- `produktion_solar`: Solar production (kW/h)
- `panels_online`: Number of online panels

## Configuration

Update `/src/lib/constants.ts`:

```typescript
export const totalPanels = 16; // Your panel count
export const energyCostPerKWh = 0.17; // CHF per kWh
export const feedInRatePerKWh = 0.08; // Feed-in rate
export const co2IntensityKgPerKWh = 0.128; // Swiss grid intensity
```

## API Integration

**Weather Data**: OpenWeatherMap API provides real-time weather conditions affecting solar efficiency.

**Fallback**: Mock weather data is used if API key is missing or requests fail.

## Architecture

```
src/
├── components/
│   ├── solar-dashboard/     # Dashboard components
│   │   ├── cards/          # Individual metric cards
│   │   ├── dashboard.tsx   # Main dashboard layout
│   │   └── wrapper.tsx     # Data fetching wrapper
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── constants.ts        # System configuration
│   ├── fetch.ts           # Data fetching logic
│   ├── parse.ts           # CSV parsing utilities
│   └── types.ts           # TypeScript definitions
└── app/
    ├── globals.css        # Tailwind styles
    ├── layout.tsx         # Root layout
    └── page.tsx           # Home page
```

## Dashboard Cards

### Energy Independence Card

**Displays**: Percentage of energy needs met by solar panels  
**Calculation**: `(1 - gridSupply / totalConsumption) × 100`  
**Shows**: Progress bar and percentage value

### Solar Panel Status Card

**Displays**: Number of online panels and maintenance schedule  
**Data**: Current online panels vs total panels (e.g., "14/16")  
**Status Badge**: Online (green), Some offline (yellow), Offline (red)  
**Additional**: Next maintenance date

### CO₂ Emissions Card

**Displays**: Total CO₂ emissions avoided (lifetime)  
**Calculation**: `totalProduction × co2IntensityKgPerKWh` (0.128 kg/kWh)  
**Equivalent**: Shows number of trees saved (`co2Avoided / 25kg per tree`)

### Money Saved Card

**Displays**: Current month savings in CHF with trend  
**Calculation**:

- Direct use: `(production - feedIn) × energyCostPerKWh`
- Feed-in earnings: `feedIn × feedInRatePerKWh`
- Total: Direct use + Feed-in earnings
  **Trend**: Percentage change vs previous month

### Monthly Production Chart

**Displays**: Bar chart of last 12 months production vs expenditure  
**Data**: Aggregated monthly totals from daily CSV data  
**Colors**: Production (green), Expenditure (orange)

### Weather Card

**Displays**: Current weather impact on solar efficiency  
**Data Sources**: OpenWeatherMap API or mock data  
**Metrics**:

- Temperature and weather icon
- Cloud cover percentage
- Solar efficiency: `(actualOutput / expectedOutput) × 100`
  **Efficiency Factors**:
- Cloud cover impact: `1 - cloudCover × 0.5`
- Temperature: `-0.4%` per degree above 25°C
- Humidity: `-2%` per 100% humidity

### Net Energy Balance Card

**Displays**: Lifetime energy surplus/deficit  
**Calculation**: `totalProduction - totalConsumption`  
**Breakdown**: Shows separate production (+) and expenditure (-)  
**Status**: Green for surplus, red for deficit

### Production vs Consumption Chart

**Displays**: Time-series line chart with multiple time ranges  
**Time Ranges**: Last day (hourly), week, month, year (daily aggregates)  
**Data**: Real-time production and consumption trends  
**Interactive**: Toggle between time periods, responsive design

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **UI Components**: Radix UI
- **Icons**: Lucide React

## Browser Support

Modern browsers supporting ES6+ features. Responsive design optimized for desktop and mobile.
