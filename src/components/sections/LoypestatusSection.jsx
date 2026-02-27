import { GlassSection } from "../shared/GlassSection";

const LOYPESTATUS_URL = "https://www.loyper.net/?lat=61.33655429927052&lng=10.095821607184234&zoom=12.060783657259536";

export function LoypestatusSection({ setRef }) {
  return (
    <GlassSection id="loypestatus" setRef={setRef} title="Løypestatus">
      <p className="section-text">Oppdatert løypestatus fra loyper.net (Skeikampen).</p>

      <div className="loypestatus-frame" data-reveal>
        <iframe
          className="loypestatus-iframe"
          src={LOYPESTATUS_URL}
          title="Lypestatus Skeikampen"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <p className="section-text section-text-muted">
        Hvis innholdet ikke vises, åpne siden direkte:
        {" "}
        <a className="inline-link" href={LOYPESTATUS_URL} target="_blank" rel="noreferrer">
          loyper.net/location/skeikampen
        </a>
      </p>
    </GlassSection>
  );
}
