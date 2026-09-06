"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

/**
 * Product photo with graceful fallback: on optimizer error, retries the raw
 * static media URL (immune to /_next/image hiccups during dev restarts) and
 * only then drops to the glyph emoji. Recovers automatically if a later
 * render has a healthy image again.
 */
export function ProductImage({
  product,
  className = "",
  sizesClass = "size-14",
  textClass = "text-2xl",
  priority = false,
  sizes = "56px",
  quality,
}: {
  product: Product;
  className?: string;
  sizesClass?: string;
  textClass?: string;
  priority?: boolean;
  /** next/image `sizes` hint matching the rendered box. */
  sizes?: string;
  quality?: number;
}) {
  // "ok" (optimizer) → "raw" (direct static file) → "glyph" (emoji).
  const [stage, setStage] = useState<"ok" | "raw" | "glyph">("ok");

  // If the product gains a working image after we latched to the fallback
  // (e.g. HMR swap), recover instead of staying on the emoji forever.
  useEffect(() => {
    setStage("ok");
  }, [product.image]);

  const showImage = product.image && stage !== "glyph";
  const rawSrc = stage === "raw" ? product.image.src : undefined;

  return (
    <div
      aria-hidden
      className={`relative flex flex-none items-center justify-center overflow-hidden bg-bg1 ${sizesClass} ${className}`}
    >
      {showImage ? (
        rawSrc ? (
          // Final retry: plain <img> straight to the bundled asset — no
          // optimizer in the path, so a broken dev optimizer cannot kill it.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={rawSrc}
            alt=""
            onError={() => setStage("glyph")}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image
            src={product.image}
            alt=""
            fill
            sizes={sizes}
            quality={quality}
            priority={priority}
            placeholder="blur"
            onError={() => setStage("raw")}
            className="object-cover"
          />
        )
      ) : (
        <span className={textClass}>{product.glyph}</span>
      )}
    </div>
  );
}
