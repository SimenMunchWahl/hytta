import { useEffect, useState } from "react";

const SKEIKAMPEN_COORDS = {
  // Skeikampen befolket sted (Yr: ~777 moh), not mountain peak.
  latitude: 61.33815,
  longitude: 10.09026,
};

const SYMBOL_TEXT = {
  clearsky: "Klarvær",
  fair: "Lettskyet",
  partlycloudy: "Delvis skyet",
  cloudy: "Overskyet",
  lightrain: "Lett regn",
  rain: "Regn",
  heavyrain: "Kraftig regn",
  lightsnow: "Lett sno",
  snow: "Sno",
  heavysnow: "Kraftig sno",
  sleet: "Sludd",
  fog: "Take",
};

function toDisplayNumber(value, digits = 0) {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";
  return value.toFixed(digits);
}

function toFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function symbolToText(symbolCode) {
  if (typeof symbolCode !== "string") return "Ukjent vær";

  const normalized = symbolCode
    .replace(/_day|_night|_polartwilight/g, "")
    .toLowerCase();

  const entry = Object.entries(SYMBOL_TEXT).find(([key]) => normalized.includes(key));
  return entry ? entry[1] : "Ukjent vær";
}

function getWeatherLabel(weatherText, temperature) {
  const roundedTemp = Math.round(temperature);
  return `${weatherText}, ${roundedTemp}\u00b0C`;
}

function getSwixRecommendation(temperature, humidity) {
  const hum = humidity < 50 ? "dry" : humidity < 80 ? "normal" : "high";

  const tempShift = hum === "high" ? 1.0 : hum === "dry" ? -1.0 : 0.0;
  const tEff = temperature + tempShift;

  if (temperature >= 0.5) return "Swix K22 Universal Klister";
  if (temperature > -1.0 && hum === "high") return "Swix K22 Universal Klister";
  if (tEff > -3.0 && tEff <= 0.5) return "Swix V45 Violet Special";
  if (tEff > -7.0 && tEff <= -3.0) return "Swix V40 Blue Extra";

  return "Swix V40 Blue Extra";
}

function getGlidRecommendation(temperature, snowfall, humidity) {
  if (temperature >= 0) return "Swix HS8 Red";
  if (temperature > -4) return "Swix HS7 Violet";

  if (temperature >= -10) {
    if (snowfall > 0 || humidity > 75) return "Swix HS6 Blue";
    return "Swix HS6 Blue";
  }

  return "Swix HS5 Turquoise";
}

function inferSnowfall(symbolCode, precipitationAmount) {
  if (typeof precipitationAmount !== "number") return 0;
  if (typeof symbolCode !== "string") return 0;

  const normalized = symbolCode.toLowerCase();
  if (normalized.includes("snow")) return precipitationAmount;

  return 0;
}

function pickCurrentTimeseries(timeseries, now = Date.now()) {
  if (!Array.isArray(timeseries) || timeseries.length === 0) return null;

  const withTs = timeseries
    .map((point) => ({ point, ts: new Date(point.time).getTime() }))
    .filter((item) => Number.isFinite(item.ts));

  if (withTs.length === 0) return null;

  const pastOrNow = withTs.filter((item) => item.ts <= now);
  if (pastOrNow.length > 0) {
    return pastOrNow.reduce((latest, item) => (item.ts > latest.ts ? item : latest)).point;
  }

  // If all points are in the future, use the earliest available.
  return withTs.reduce((earliest, item) => (item.ts < earliest.ts ? item : earliest)).point;
}

async function fetchMetWeather(coords, signal) {
  const query = new URLSearchParams({
    lat: String(coords.latitude),
    lon: String(coords.longitude),
  }).toString();

  const nowcastUrl = `https://api.met.no/weatherapi/nowcast/2.0/complete?${query}`;
  const locationForecastUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?${query}`;

  const fetchJson = async (url) => {
    const response = await fetch(url, {
      signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`MET request failed: ${response.status}`);
    }

    return response.json();
  };

  try {
    return await fetchJson(nowcastUrl);
  } catch {
    return fetchJson(locationForecastUrl);
  }
}

const DEFAULT_STATE = {
  name: "Skeikampen",
  weatherLabel: "Laster vær...",
  waxLabel: "Anbefalt festesmøring: --",
  glidLabel: "Anbefalt glid: --",
  metrics: {
    weatherText: "--",
    temperature: "--",
    apparentTemperature: "--",
    humidity: "--",
    windSpeed: "--",
    windDirection: "--",
    cloudCover: "--",
    precipitation: "--",
    snowfall: "--",
    elevation: "--",
  },
  rawMetrics: {
    temperature: null,
    apparentTemperature: null,
    humidity: null,
    windSpeed: null,
    windDirection: null,
    cloudCover: null,
    precipitation: null,
    snowfall: null,
    elevation: null,
  },
};

const SKEIKAMPEN_FALLBACK_ELEVATION = 777;

export function useCurrentWeather() {
  const [weatherState, setWeatherState] = useState(DEFAULT_STATE);

  useEffect(() => {
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        const data = await fetchMetWeather(SKEIKAMPEN_COORDS, controller.signal);

        const timeseries = data?.properties?.timeseries;
        const current = pickCurrentTimeseries(timeseries);

        const instantDetails = current?.data?.instant?.details;
        const oneHour = current?.data?.next_1_hours;
        const sixHours = current?.data?.next_6_hours;

        const temperature = toFiniteNumber(instantDetails?.air_temperature);
        const humidity = toFiniteNumber(instantDetails?.relative_humidity);
        const windSpeed = toFiniteNumber(instantDetails?.wind_speed);
        const windDirection = toFiniteNumber(instantDetails?.wind_from_direction);
        const cloudCover = toFiniteNumber(instantDetails?.cloud_area_fraction);
        const precipitation = toFiniteNumber(
          oneHour?.details?.precipitation_amount ??
            sixHours?.details?.precipitation_amount ??
            0
        );
        const symbolCode = oneHour?.summary?.symbol_code ?? sixHours?.summary?.symbol_code;
        const elevation =
          toFiniteNumber(data?.geometry?.coordinates?.[2]) ??
          SKEIKAMPEN_FALLBACK_ELEVATION;

        // Keep the widget resilient to partial MET payloads.
        if (temperature === null || humidity === null) {
          throw new Error("Ugyldig værdata");
        }

        const safeWindSpeed = windSpeed ?? 0;
        const safeWindDirection = windDirection ?? 0;
        const safeCloudCover = cloudCover ?? 0;
        const safePrecipitation = precipitation ?? 0;
        const snowfall = inferSnowfall(symbolCode, safePrecipitation);
        const weatherText = symbolToText(symbolCode);
        const feste = getSwixRecommendation(temperature, humidity);
        const glid = getGlidRecommendation(temperature, snowfall, humidity);

        setWeatherState({
          name: "Skeikampen",
          weatherLabel: getWeatherLabel(weatherText, temperature),
          waxLabel: `Anbefalt festesmøring: ${feste}`,
          glidLabel: `Anbefalt glid: ${glid}`,
          metrics: {
            weatherText,
            temperature: `${toDisplayNumber(temperature)}\u00b0C`,
            apparentTemperature: `${toDisplayNumber(temperature)}\u00b0C`,
            humidity: `${toDisplayNumber(humidity)}%`,
            windSpeed: `${toDisplayNumber(safeWindSpeed, 1)} m/s`,
            windDirection: `${toDisplayNumber(safeWindDirection)}\u00b0`,
            cloudCover: `${toDisplayNumber(safeCloudCover)}%`,
            precipitation: `${toDisplayNumber(safePrecipitation, 1)} mm/t`,
            snowfall: `${toDisplayNumber(snowfall, 1)} mm/t`,
            elevation: `${toDisplayNumber(elevation)} moh`,
          },
          rawMetrics: {
            temperature,
            apparentTemperature: temperature,
            humidity,
            windSpeed: safeWindSpeed,
            windDirection: safeWindDirection,
            cloudCover: safeCloudCover,
            precipitation: safePrecipitation,
            snowfall,
            elevation,
          },
        });
      } catch {
        setWeatherState({
          name: "Skeikampen",
          weatherLabel: "Vær utilgjengelig",
          waxLabel: "Anbefalt festesmøring: utilgjengelig",
          glidLabel: "Anbefalt glid: utilgjengelig",
          metrics: DEFAULT_STATE.metrics,
          rawMetrics: DEFAULT_STATE.rawMetrics,
        });
      }
    };

    fetchWeather();

    return () => controller.abort();
  }, []);

  return weatherState;
}
