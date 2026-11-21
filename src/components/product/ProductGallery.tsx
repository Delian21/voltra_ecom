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
        className="relative aspect-square touch-pan-y overflow-hidden rounded-xl border border-line bg-bg1 p-3 outline-none focus-visible:border-volt"
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
          className="object-contain"
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
              className={`relative size-16 overflow-hidden rounded-lg border bg-bg1 p-1 transition-colors ${
                i === active
                  ? "border-volt"
                  : "border-line opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={shot}
                alt=""
                fill
                sizes="64px"
                placeholder="blur"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
