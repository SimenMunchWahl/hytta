import { FACILITIES } from "../../data/siteContent";
import { GlassSection } from "../shared/GlassSection";

export function FacilitiesSection({ setRef }) {
  return (
    <GlassSection id="fasiliteter" setRef={setRef} title="Fasiliteter">
      <ul className="section-list">
        {FACILITIES.map((facility) => (
          <li key={facility}>{facility}</li>
        ))}
      </ul>
    </GlassSection>
  );
}
