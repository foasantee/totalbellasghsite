"use client";

import { useRef, useState } from "react";
import type { TouchEvent } from "react";
import Image from "next/image";

export type GalleryImage = { id: string; url: string };

// Anything shorter than this is treated as a tap/scroll, not a swipe.
const SWIPE_THRESHOLD_PX = 40;

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) {
    return <div className="product-detail__gallery" />;
  }

  const hasMultiple = images.length > 1;

  const goTo = (index: number) => setActiveIndex(((index % images.length) + images.length) % images.length);
  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) goNext();
    else goPrev();
  };

  return (
    <div className="product-detail__gallery">
      <div
        className="product-detail__main-image"
        onTouchStart={hasMultiple ? handleTouchStart : undefined}
        onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
      >
        <Image
          key={images[activeIndex].id}
          src={images[activeIndex].url}
          alt={name}
          fill
          sizes="(min-width: 992px) 50vw, 100vw"
          priority
        />
        {hasMultiple ? (
          <>
            <button
              type="button"
              className="product-detail__nav-arrow product-detail__nav-arrow--prev"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="product-detail__nav-arrow product-detail__nav-arrow--next"
              onClick={goNext}
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="product-detail__thumbnails" role="tablist" aria-label="Product photos">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.id}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Photo ${index + 1}`}
              className={`product-detail__thumbnail${
                index === activeIndex ? " product-detail__thumbnail--active" : ""
              }`}
              onClick={() => goTo(index)}
            >
              <Image src={image.url} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
