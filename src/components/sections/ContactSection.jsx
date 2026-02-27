import { CONTACT } from "../../data/siteContent";
import { GlassSection } from "../shared/GlassSection";

export function ContactSection({ setRef }) {
  return (
    <GlassSection id="kontakt" setRef={setRef} title="Kontakt">
      <p className="section-text">{CONTACT.description}</p>
    </GlassSection>
  );
}
