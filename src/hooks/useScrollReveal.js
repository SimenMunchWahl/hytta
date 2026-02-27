import { useEffect } from "react";

export function useScrollReveal(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const elements = document.querySelectorAll("[data-reveal]");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [enabled]);
}
