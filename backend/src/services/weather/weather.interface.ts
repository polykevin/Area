export interface WeatherData {
  temperature: number | null;
  windspeed: number | null;
  humidity?: number | null;
  condition?: string | null;
  timestamp: number;
}

