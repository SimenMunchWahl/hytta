import { VISIT_PHASE_SECTIONS } from "../../data/siteContent";
import { GlassSection } from "../shared/GlassSection";

export function VisitPhaseSections({ setRef }) {
  return VISIT_PHASE_SECTIONS.map((section) => (
    <GlassSection key={section.id} id={section.id} setRef={setRef} title={section.title}>
      <p className="section-text">{section.intro}</p>
      <ul className="section-list">
        {section.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </GlassSection>
  ));
}
