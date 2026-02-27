export function GlassSection({ id, setRef, title, children }) {
  return (
    <section id={id} ref={setRef(id)} className="section">
      <div className="section-glass" data-reveal>
        <h2 className="section-title">{title}</h2>
        {children}
      </div>
    </section>
  );
}
