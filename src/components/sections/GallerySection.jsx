import { useEffect, useMemo, useState } from "react";
import { GALLERY_ITEMS } from "../../data/siteContent";
import { GlassSection } from "../shared/GlassSection";
import { GalleryCard } from "../shared/GalleryCard";

export function GallerySection({ setRef }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const imageItems = useMemo(
    () => GALLERY_ITEMS.filter((item) => item.image),
    [],
  );

  const activeItem =
    activeIndex !== null && activeIndex >= 0 && activeIndex < imageItems.length
      ? imageItems[activeIndex]
      : null;

  useEffect(() => {
    if (activeItem === null) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % imageItems.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => {
          if (prev === null) return 0;
          return (prev - 1 + imageItems.length) % imageItems.length;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItem, imageItems.length]);

  const showPrev = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + imageItems.length) % imageItems.length;
    });
  };

  const showNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % imageItems.length;
    });
  };

  return (
    <>
      <GlassSection id="galleri" setRef={setRef} title="Galleri">
        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item, index) => {
            const imageIndex = imageItems.findIndex(
              (imageItem) => imageItem.image === item.image,
            );

            return (
              <GalleryCard
                key={item.title}
                title={item.title}
                image={item.image}
                delay={120 + index * 80}
                onClick={
                  imageIndex >= 0 ? () => setActiveIndex(imageIndex) : undefined
                }
              />
            );
          })}
        </div>
        <p
          className="section-text section-text-muted"
          data-reveal
          style={{ "--reveal-delay": "360ms" }}
        >
          Klikk på et bilde for stor visning.
        </p>
      </GlassSection>

      {activeItem ? (
        <div className="gallery-lightbox" onClick={() => setActiveIndex(null)}>
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setActiveIndex(null)}
            aria-label="Lukk bildevisning"
          >
            ×
          </button>

          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-nav--left"
            onClick={(event) => {
              event.stopPropagation();
              showPrev();
            }}
            aria-label="Forrige bilde"
          >
            {"<"}
          </button>

          <figure
            className="gallery-lightbox-frame"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="gallery-lightbox-image"
              src={activeItem.image}
              alt={activeItem.title}
            />
            <figcaption className="gallery-lightbox-caption">
              {activeItem.title}
            </figcaption>
          </figure>

          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-nav--right"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Neste bilde"
          >
            {">"}
          </button>
        </div>
      ) : null}
    </>
  );
}
