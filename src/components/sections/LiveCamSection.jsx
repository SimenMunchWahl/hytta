import { GlassSection } from "../shared/GlassSection";

const SKEIKAMPEN_LIVE_EMBED =
  "https://www.youtube.com/embed/dzvmJr3iOFg?autoplay=1&mute=1&playsinline=1&rel=0";

export function LiveCamSection({ setRef }) {
  return (
    <GlassSection id="livecam" setRef={setRef} title="Livecam Skeikampen">
      <div className="livecam-frame" data-reveal>
        <iframe
          className="livecam-iframe"
          src={SKEIKAMPEN_LIVE_EMBED}
          title="Skeikampen livecam"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </GlassSection>
  );
}
