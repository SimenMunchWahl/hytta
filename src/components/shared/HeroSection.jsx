import { HERO_CONTENT } from "../../data/siteContent";
import { getVisitPhaseCta } from "../../data/visitors";

export function HeroSection({
  onVisitPhaseNavigate,
  welcomeMessage,
  hideWelcomeMessage,
}) {
  const visitPhaseCta = getVisitPhaseCta();

  return (
    <section className="hero">
      <div className="hero-panel" data-reveal style={{ "--reveal-delay": "120ms" }}>
        <p className="kicker">{HERO_CONTENT.kicker}</p>

        <div
          className={`hero-title-wrap ${
            hideWelcomeMessage ? "hero-title-wrap--hidden" : ""
          }`}
        >
          <h1 className="hero-title">{welcomeMessage}</h1>
          <span className="hero-title-underline" aria-hidden="true" />
        </div>

        {HERO_CONTENT.description ? (
          <p className="hero-description">{HERO_CONTENT.description}</p>
        ) : null}

        {visitPhaseCta ? (
          <div className="hero-actions" data-reveal style={{ "--reveal-delay": "240ms" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onVisitPhaseNavigate(visitPhaseCta.targetId)}
            >
              {visitPhaseCta.label}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
