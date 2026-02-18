import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const RIO_DE_JANEIRO_LAT = -22.9068;
const RIO_DE_JANEIRO_LON = -43.1729;
const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?latitude=${RIO_DE_JANEIRO_LAT}&longitude=${RIO_DE_JANEIRO_LON}&current=temperature_2m,weather_code&timezone=America/Sao_Paulo`;

type WeatherIcon = "sun" | "cloudy" | "partly-cloudy" | "rain" | "snow" | "fog" | "thunderstorm";

function getWeatherIcon(code: number): WeatherIcon {
  if (code === 0) return "sun";
  if (code >= 1 && code <= 3) return "partly-cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95 && code <= 99) return "thunderstorm";
  return "cloudy";
}

function WeatherIconSvg({ type }: { type: WeatherIcon }) {
  const size = 18;
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
  switch (type) {
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      );
    case "cloudy":
      return (
        <svg {...common}>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      );
    case "partly-cloudy":
      return (
        <svg {...common}>
          <path d="M9 18a5 5 0 0 1 5-5c.5 0 1 .07 1.48.2A4 4 0 0 0 15 7a4 4 0 0 0-4 4 3 3 0 0 0 3 3h8a3 3 0 0 0 0-6h-.98A6 6 0 0 0 9 6a6 6 0 0 0 0 12z" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          <path d="M12 14v6M8 16v6M16 16v6" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          <path d="M12 14v2M10 15l2 2 2-2M12 16v2" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M9 18h6M3 14h18M6 10h12" />
        </svg>
      );
    case "thunderstorm":
      return (
        <svg {...common}>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          <path d="M13 12l-2 4h3l-2 4" />
        </svg>
      );
    default:
      return <svg {...common}><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2" /></svg>;
  }
}

export function GreetingSection() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(WEATHER_URL)
      .then((res) => res.json())
      .then((data) => {
        const curr = data?.current;
        if (curr) {
          if (typeof curr.temperature_2m === "number") setTemperature(Math.round(curr.temperature_2m));
          if (typeof curr.weather_code === "number") setWeatherCode(curr.weather_code);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "relative",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        minHeight: 280,
        margin: "0 16px 24px",
        alignSelf: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Content */}
      <div
        style={{
          position: "relative",
          padding: "32px 24px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "48px",
            fontWeight: 700,
            color: "#fff",
            textShadow: "0 1px 3px rgba(0,0,0,0.2)",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          Olá, Alex.
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.95)",
            textShadow: "0 1px 2px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          Bom dia
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginTop: 12,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "15.4px",
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Rio de Janeiro
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "15.4px",
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }}
          >
            <WeatherIconSvg type={weatherCode !== null ? getWeatherIcon(weatherCode) : "sun"} />
            {loading ? "…°C" : temperature !== null ? `${temperature}°C` : "—°C"}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
