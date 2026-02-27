import { PRACTICAL_INFO } from "../../data/siteContent";
import { GlassSection } from "../shared/GlassSection";

export function PracticalSection({ setRef }) {
  return (
    <GlassSection id="tips-og-triks" setRef={setRef} title="Tips og triks">
      <article data-reveal style={{ "--reveal-delay": "120ms" }}>
        <ul className="section-list">
          {PRACTICAL_INFO.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </article>
    </GlassSection>
  );
}
