import { useState } from "react";
import { NAV_ITEMS } from "../../data/siteContent";

export function SiteHeader({ onNavigate, isSolid, visitInfo, weather }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (id) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <nav
        className={`site-nav ${isSolid ? "site-nav--solid" : "site-nav--overlay"}`}
        aria-label="Hovednavigasjon"
      >
        <div className="nav-group desktop-only">
          {NAV_ITEMS.slice(0, 2).map((item) => (
            <button
              key={item.id}
              type="button"
              className="btn btn-nav"
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}

          {visitInfo ? (
            <div className="nav-visit-meta">
              <p className="nav-visit-line">{visitInfo.guestsLabel}</p>
              {visitInfo.stayLabel ? <p className="nav-visit-line">{visitInfo.stayLabel}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="logo-wrap">
          <button type="button" className="logo-btn" onClick={() => handleNavigate("top")}>
            Elkjærvegen 28
          </button>
          <p className="logo-sub">Skeikampen</p>
        </div>

        <div className="nav-group nav-group-end desktop-only">
          <div className="nav-weather-meta">
            <p className="nav-weather-line">{weather.weatherLabel}</p>
            <p className="nav-weather-line">{weather.waxLabel}</p>
          </div>

          {NAV_ITEMS.slice(2).map((item) => (
            <button
              key={item.id}
              type="button"
              className="btn btn-nav"
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`mobile-menu-btn mobile-only ${isMenuOpen ? "mobile-menu-btn--open" : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Lukk meny" : "Apne meny"}
        >
          <span className="mobile-menu-line" />
          <span className="mobile-menu-line" />
          <span className="mobile-menu-line" />
        </button>
      </nav>

      <div className={`site-mobile-menu mobile-only ${isMenuOpen ? "site-mobile-menu--open" : ""}`}>
        <div className="mobile-nav-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="mobile-nav-link"
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {visitInfo ? (
          <div className="mobile-visit-meta">
            <p className="mobile-visit-line">{visitInfo.guestsLabel}</p>
            {visitInfo.stayLabel ? <p className="mobile-visit-line">{visitInfo.stayLabel}</p> : null}
          </div>
        ) : null}

        <div className="mobile-weather-meta">
          <p className="mobile-visit-line">{weather.weatherLabel}</p>
          <p className="mobile-visit-line">{weather.waxLabel}</p>
        </div>
      </div>
    </header>
  );
}
