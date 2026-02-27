import { useRef } from "react";

export function useSectionScroll() {
  const refs = useRef({});

  const setSectionRef = (id) => (element) => {
    refs.current[id] = element;
  };

  const scrollToSection = (id) => {
    const element = refs.current[id];
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return { setSectionRef, scrollToSection };
}
