import { GlassSection } from "../shared/GlassSection";

function clampPercent(value) {
  return Math.max(0, Math.min(100, value));
}

function ratioFromRange(value, min, max) {
  if (typeof value !== "number") return 0;
  return clampPercent(((value - min) / (max - min)) * 100);
}

function GaugeCard({ label, valueText, ratio, tone, size = "normal" }) {
  return (
    <article
      className={`weather-gauge-card weather-gauge-card--${tone} weather-gauge-card--${size}`}
      data-reveal
    >
      <p className="weather-gauge-label">{label}</p>
      <p className="weather-gauge-value">{valueText}</p>
      <div className="weather-gauge-track" aria-hidden="true">
        <span className="weather-gauge-fill" style={{ width: `${ratio}%` }} />
      </div>
    </article>
  );
}

function WaxCard({ title, recommendation, tone }) {
  return (
    <article
      className={`weather-summary-card weather-summary-card--${tone}`}
      data-reveal
    >
      <p className="weather-summary-title">{title}</p>
      <p className="weather-summary-main weather-summary-main-small">
        {recommendation}
      </p>
    </article>
  );
}

function WindDial({ value }) {
  const angle = typeof value === "number" ? value : 0;

  return (
    <article className="weather-wind-card" data-reveal>
      <p className="weather-summary-title">Vindretning</p>
      <div className="weather-wind-dial" aria-hidden="true">
        <span
          className="weather-wind-arrow"
          style={{ transform: `translate(-50%, -88%) rotate(${angle}deg)` }}
        />
        <span className="weather-wind-dot" />
      </div>
      <p className="weather-summary-sub">
        {typeof value === "number" ? `${Math.round(value)}deg` : "--"}
      </p>
    </article>
  );
}

function ElevationCard({ valueText }) {
  return (
    <article className="weather-gauge-card weather-gauge-card--elevation" data-reveal>
      <p className="weather-gauge-label">Hoyde over havet</p>
      <div className="weather-elevation-icon" aria-hidden="true">
        <span className="weather-mountain-back" />
        <span className="weather-mountain-front" />
      </div>
      <p className="weather-gauge-value">{valueText}</p>
    </article>
  );
}

export function WeatherWaxSection({ setRef, weather }) {
  const { metrics, rawMetrics, glidLabel, waxLabel } = weather;

  const tempRatio = ratioFromRange(rawMetrics.temperature, -20, 5);
  const humidityRatio = ratioFromRange(rawMetrics.humidity, 0, 100);
  const windRatio = ratioFromRange(rawMetrics.windSpeed, 0, 20);
  const cloudRatio = ratioFromRange(rawMetrics.cloudCover, 0, 100);
  const precipRatio = ratioFromRange(rawMetrics.precipitation, 0, 4);
  const snowRatio = ratioFromRange(rawMetrics.snowfall, 0, 4);

  return (
    <GlassSection id="vaer-og-smoring" setRef={setRef} title="Vær og smøring">
      <div className="weather-dashboard">
        <section
          className="weather-summary-card weather-summary-card--lead weather-dashboard-item"
          data-reveal
        >
          <p className="weather-summary-title">{weather.name}</p>
          <p className="weather-summary-main">{weather.weatherLabel}</p>
          <p className="weather-summary-sub">
            Følelse: {metrics.apparentTemperature}
          </p>
        </section>

        <div className="weather-wax-split weather-dashboard-item">
          <WaxCard
            title="Swix glid"
            recommendation={glidLabel.replace("Anbefalt glid: ", "")}
            tone="glid"
          />
          <WaxCard
            title="Swix festesmøring"
            recommendation={waxLabel.replace("Anbefalt festesmøring: ", "")}
            tone="kick"
          />
        </div>
      </div>

      <div className="weather-gauges-grid">
        <GaugeCard
          label="Temperatur"
          valueText={metrics.temperature}
          ratio={tempRatio}
          tone="temp"
          size="wide"
        />
        <GaugeCard
          label="Luftfuktighet"
          valueText={metrics.humidity}
          ratio={humidityRatio}
          tone="humid"
          size="wide"
        />
        <GaugeCard
          label="Vind"
          valueText={metrics.windSpeed}
          ratio={windRatio}
          tone="wind"
          size="normal"
        />
        <GaugeCard
          label="Skydekke"
          valueText={metrics.cloudCover}
          ratio={cloudRatio}
          tone="cloud"
        />
        <GaugeCard
          label="Nedbør"
          valueText={metrics.precipitation}
          ratio={precipRatio}
          tone="rain"
        />
        <GaugeCard
          label="Snøfall"
          valueText={metrics.snowfall}
          ratio={snowRatio}
          tone="snow"
        />
        <ElevationCard valueText={metrics.elevation} />
        <WindDial value={rawMetrics.windDirection} />
      </div>
    </GlassSection>
  );
}
