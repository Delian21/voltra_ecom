"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductImage } from "@/components/product/ProductImage";
import { StockPill } from "@/components/product/StockPill";
import { useCart } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/components/product/PriceTag";

/** Spec chips come from the product's meta line ("18W fast charge · dual USB-C"). */
function specChips(meta: string): string[] {
  return meta
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const add = useCart((s) => s.add);
  const outOfStock = product.stock <= 0;
  const chips = specChips(product.meta);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="group overflow-hidden rounded-xl border border-line bg-bg2 transition-colors hover:border-volt">
        <div className="relative">
          <div
            aria-hidden
            className="relative aspect-square overflow-hidden bg-bg1 transition-transform duration-300 group-hover:scale-105"
          >
            <ProductImage
              product={product}
              sizesClass="absolute inset-0 size-full"
              textClass="text-4xl"
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
              fit="cover"
            />
          </div>

          <Link
            href={`/shop/${product.slug}`}
            aria-label={product.name}
            className="absolute inset-0 z-[1]"
          />

          <span className="pointer-events-none absolute left-2.5 top-2.5 z-[2] rounded-full border border-line bg-bg0/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-volt-text backdrop-blur-sm">
            {product.category}
          </span>

          <button
            type="button"
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              add(product.id, "unit");
              toast.success(`Added — ${formatNaira(product.price)} · ${product.name}`);
            }}
            className="absolute bottom-2.5 right-2.5 z-[2] flex size-8 items-center justify-center rounded-full bg-volt text-bg0 shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
        </div>

        <Link href={`/shop/${product.slug}`} className="block p-4">
          <h3 className="text-[13.5px] font-semibold leading-snug text-ink-hi">
            {product.name}
          </h3>
          {chips.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-md border border-line bg-bg1 px-1.5 py-0.5 font-mono text-[9.5px] text-ink-mid"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3.5 flex items-center justify-between gap-2">
            <PriceTag amount={product.price} />
            <StockPill stock={product.stock} />
          </div>
        </Link>
      </div>

      {/* Quick-view overlay — desktop only */}
      {hovered && (
        <div
          className="absolute left-0 right-0 top-0 z-10 mx-auto w-[calc(100%-32px)] max-w-[220px] rounded-xl border border-line-strong bg-bg0/96 p-3.5 shadow-xl backdrop-blur-sm"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-volt-text">
            {product.category}
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-snug text-ink-hi">
            {product.name}
          </p>
          <p className="mt-1 text-xs text-ink-mid">{product.meta}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <PriceTag amount={product.price} className="text-base" />
            <StockPill stock={product.stock} />
          </div>
          <p className="mt-2.5 text-[11px] leading-relaxed text-ink-mid">
            {product.desc.split(".")[0]}.
          </p>
          <Button
            size="sm"
            className="mt-3 w-full"
            disabled={outOfStock}
            onClick={(e) => {
              e.preventDefault();
              add(product.id, "unit");
              toast.success(`Added — ${formatNaira(product.price)} · ${product.name}`);
            }}
          >
            {outOfStock ? (
              "Out of stock"
            ) : (
              <>
                <Plus className="size-3.5" />
                <span className="ml-1.5">Quick add</span>
              </>
            )}
          </Button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/shop/${product.slug}`;
            }}
            className="mt-2 flex w-full items-center justify-center gap-1 font-mono text-[10px] text-volt-text transition-colors hover:text-volt"
          >
            View details
            <ArrowRight className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}
