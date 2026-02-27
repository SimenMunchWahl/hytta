import { ABOUT_TEXT } from "../../data/siteContent";
import { GlassSection } from "../shared/GlassSection";

export function AboutSection({ setRef }) {
  return (
    <GlassSection id="om" setRef={setRef} title="Om hytta">
      <p className="section-text">{ABOUT_TEXT}</p>
    </GlassSection>
  );
}
