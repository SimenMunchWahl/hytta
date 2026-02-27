export function GalleryCard({ title, image, delay = 0, onClick }) {
  const hasImage = Boolean(image);
  const isClickable = hasImage && typeof onClick === "function";

  return (
    <article
      className={`gallery-card ${hasImage ? "gallery-card--image" : ""} ${isClickable ? "gallery-card--clickable" : ""}`}
      data-reveal
      style={{ "--reveal-delay": `${delay}ms` }}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <h3 className="card-title">{title}</h3>
      {hasImage ? (
        <img className="gallery-image" src={image} alt={title} loading="lazy" />
      ) : (
        <p className="card-body">Plassholder</p>
      )}
    </article>
  );
}
