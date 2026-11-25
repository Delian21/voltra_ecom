"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductImage } from "@/components/product/ProductImage";
import { StockPill } from "@/components/product/StockPill";
import { useCart } from "@/lib/store/cart";
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
  const add = useCart((s) => s.add);
  const outOfStock = product.stock <= 0;
  const chips = specChips(product.meta);

  return (
    <div className="group overflow-hidden rounded-xl border border-line bg-bg2 transition duration-200 ease-out hover:-translate-y-1 hover:border-volt/40">
      <div className="relative">
        <div
          aria-hidden
          className="relative aspect-square overflow-hidden bg-bg1"
        >
          <ProductImage
            product={product}
            sizesClass="absolute inset-0 size-full"
            className="transition-transform duration-300 ease-out group-hover:scale-[1.04]"
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
  );
}
