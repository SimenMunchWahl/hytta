export function SiteBackground({ backgroundImage, parallaxOffset = 0 }) {
  return (
    <>
      <div
        className="site-background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${parallaxOffset}px) scale(1.08)`,
        }}
        aria-hidden="true"
      />
      <div className="site-background-overlay" aria-hidden="true" />
    </>
  );
}
