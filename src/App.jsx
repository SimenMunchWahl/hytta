import { useEffect, useState } from "react";
import { PasswordGate } from "./components/auth/PasswordGate";
import { SiteBackground } from "./components/layout/SiteBackground";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteHeader } from "./components/layout/SiteHeader";
import { AboutSection } from "./components/sections/AboutSection";
import { ContactSection } from "./components/sections/ContactSection";
import { GallerySection } from "./components/sections/GallerySection";
import { PracticalSection } from "./components/sections/PracticalSection";
import { VisitPhaseSections } from "./components/sections/VisitPhaseSections";
import { WeatherWaxSection } from "./components/sections/WeatherWaxSection";
import { LiveCamSection } from "./components/sections/LiveCamSection";
import { LoypestatusSection } from "./components/sections/LoypestatusSection";
import { HeroSection } from "./components/shared/HeroSection";
import { getHeaderVisitInfo, getWelcomeMessage } from "./data/visitors";
import { useCurrentWeather } from "./hooks/useCurrentWeather";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useSectionScroll } from "./hooks/useSectionScroll";
import backgroundImage from "./assets/images/hytta.png";
import "./styles/app.css";

const BACKGROUND_IMAGE = backgroundImage;
const GATE_STORAGE_KEY = "hytta_gate_unlocked";
const APP_PASSWORD = (import.meta.env.VITE_APP_PASSWORD || "hytta123").trim();

export default function App() {
  const { setSectionRef, scrollToSection } = useSectionScroll();
  const [isHeaderSolid, setIsHeaderSolid] = useState(false);
  const [hideWelcomeMessage, setHideWelcomeMessage] = useState(false);
  const [backgroundParallax, setBackgroundParallax] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;

    return sessionStorage.getItem(GATE_STORAGE_KEY) === "true";
  });
  const welcomeMessage = getWelcomeMessage();
  const headerVisitInfo = getHeaderVisitInfo();
  const weather = useCurrentWeather();
  useScrollReveal(isUnlocked);

  useEffect(() => {
    const onScroll = () => {
      const offset = -Math.min(window.scrollY * 0.22, 180);
      setBackgroundParallax(offset);
      setIsHeaderSolid(window.scrollY > window.innerHeight - 120);

      const header = document.querySelector(".site-header");
      const heroTitle = document.querySelector(".hero-title-wrap");
      if (!header || !heroTitle) return;

      const headerBottom = header.getBoundingClientRect().bottom;
      const titleTop = heroTitle.getBoundingClientRect().top;
      setHideWelcomeMessage(titleTop <= headerBottom + 6);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleUnlock = (password) => {
    if (password.trim() !== APP_PASSWORD) return false;

    sessionStorage.setItem(GATE_STORAGE_KEY, "true");
    setIsUnlocked(true);
    return true;
  };

  const handleLogout = () => {
    sessionStorage.removeItem(GATE_STORAGE_KEY);
    setIsUnlocked(false);
    setIsHeaderSolid(false);
    setHideWelcomeMessage(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if (!isUnlocked) {
    return (
      <div className="page-shell">
        <SiteBackground
          backgroundImage={BACKGROUND_IMAGE}
          parallaxOffset={backgroundParallax}
        />
        <PasswordGate onUnlock={handleUnlock} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <SiteBackground
        backgroundImage={BACKGROUND_IMAGE}
        parallaxOffset={backgroundParallax}
      />
      <SiteHeader
        onNavigate={scrollToSection}
        isSolid={isHeaderSolid}
        visitInfo={headerVisitInfo}
        weather={weather}
      />

      <main className="page-content">
        <div id="top" ref={setSectionRef("top")} className="anchor-top" />

        <HeroSection
          onVisitPhaseNavigate={scrollToSection}
          welcomeMessage={welcomeMessage}
          hideWelcomeMessage={hideWelcomeMessage}
        />

        <div className="content-shell">
          <div className="content-layout">
            <div className="content-main">
              <AboutSection setRef={setSectionRef} />
              <GallerySection setRef={setSectionRef} />
              <LoypestatusSection setRef={setSectionRef} />
              <PracticalSection setRef={setSectionRef} />
              <VisitPhaseSections setRef={setSectionRef} />
              <ContactSection setRef={setSectionRef} />
            </div>

            <aside className="content-side">
              <WeatherWaxSection setRef={setSectionRef} weather={weather} />
              <LiveCamSection setRef={setSectionRef} />
            </aside>
          </div>
          <SiteFooter onLogout={handleLogout} />
        </div>
      </main>
    </div>
  );
}
