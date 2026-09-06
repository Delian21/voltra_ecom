"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";

/**
 * Product detail gallery — main shot with blur placeholder, switchable via
 * the angle thumbnails beneath, with mobile swipe gestures and arrow-key
 * navigation on the focused gallery.
 */
export function ProductGallery({ product }: { product: Product }) {
  const gallery =
    product.gallery.length > 0 ? product.gallery : [product.image];
  const [active, setActive] = useState(0);
  const current = gallery[Math.min(active, gallery.length - 1)];

  const goTo = useCallback(
    (i: number) => setActive(Math.max(0, Math.min(gallery.length - 1, i))),
    [gallery.length],
  );

  // Arrow-key navigation when focus is inside the gallery region.
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(active + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(active - 1);
      }
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  // Touch swipe on the main image (mobile). 48px threshold filters scrolls.
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (start === null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) < 48) return; // likely a scroll, not a swipe
    goTo(dx < 0 ? active + 1 : active - 1);
  };

  return (
    <div ref={rootRef}>
      <div
        role="group"
        tabIndex={0}
        aria-label={`${product.name} gallery — use arrow keys to switch photos`}
        className="relative h-72 touch-pan-y overflow-hidden rounded-xl border border-line bg-bg1 outline-none focus-visible:border-volt md:h-96"
        style={{
          backgroundImage:
            "radial-gradient(160px 120px at 70% 20%, rgba(198,255,62,0.16), transparent 70%), linear-gradient(150deg, #1B2130, #12161F)",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={current.src}
          src={current}
          alt={`${product.name} — view ${active + 1} of ${gallery.length}`}
          fill
          sizes="(min-width: 768px) 560px, 100vw"
          quality={85}
          priority={active === 0}
          placeholder="blur"
          className="object-cover"
          draggable={false}
        />
      </div>

      {gallery.length > 1 && (
        <div
          role="tablist"
          aria-label={`${product.name} photos`}
          className="mt-3 flex gap-2.5"
        >
          {gallery.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View photo ${i + 1}`}
              onClick={() => goTo(i)}
              className={`relative h-16 w-20 overflow-hidden rounded-lg border transition-colors ${
                i === active
                  ? "border-volt"
                  : "border-line opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={shot}
                alt=""
                fill
                sizes="80px"
                placeholder="blur"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
