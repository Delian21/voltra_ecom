"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCartSummary } from "@/components/cart/useCartSummary";
import { useCart } from "@/lib/store/cart";
import { getAllProductsSync } from "@/lib/data/catalog";
import type { PricingMode, Product } from "@/lib/types";
import { formatNaira } from "@/components/product/PriceTag";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";

export function CartLines() {
  const { items } = useCartSummary();
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const add = useCart((s) => s.add);

  // Build a set of cart SKUs for cross-sell exclusion.
  const cartIds = new Set(items.map((it) => it.line.id));

  /** Same-category, in-stock picks the shopper might want next.
   * Reproducible ordering: by price desc, capped at 3. */
  function relatedProducts(): Product[] {
    const catalog = getAllProductsSync();
    // Pick a category that appears in the cart, preferring the most
    // expensive line's category so the picks feel relevant.
    const preferred = items
      .slice()
      .sort((a, b) => b.lineTotal - a.lineTotal)[0]?.product.category;
    const pool =
      preferred &&
      catalog.some((p) => p.category === preferred) ?
      catalog
        .filter((p) => p.category === preferred)
        .filter((p) => !cartIds.has(p.id))
        .sort((a, b) => b.price - a.price)
        .slice(0, 3) :
      // Fallback: top 3 across the whole catalog by price desc.
      catalog
        .filter((p) => !cartIds.has(p.id))
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);
    return pool;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="max-w-[240px] text-[13.5px] leading-6 text-ink-mid">
          Your cart is empty. Power up from the shop.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <ul>
      {items.map(({ line, product, unitPrice, lineTotal, saved, retailTotal }) => (
        <li
          key={line.id}
          className="flex gap-3.5 border-b border-line py-4 last:border-b-0"
        >
          <ProductImage
            product={product}
            sizesClass="size-14 rounded-lg"
            className="border border-line"
            textClass="text-2xl"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink-hi">
              {product.name}
            </p>
            <p className="mt-0.5 font-mono text-[10.5px] text-ink-low">
              {formatNaira(unitPrice)}
              {line.mode === "wholesale" && " /unit · wholesale, steps of 10"}
            </p>
            {line.mode === "wholesale" && (
              <p className="mt-1 font-mono text-[10px] text-good">
                Save {formatNaira(saved)} vs. retail ({formatNaira(retailTotal)})
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-xs"
                aria-label={`Decrease quantity of ${product.name}`}
                onClick={() => updateQty(line.id, -1)}
              >
                <Minus />
              </Button>
              <span className="min-w-[22px] text-center font-mono text-xs text-ink-hi">
                {line.qty}
              </span>
              <Button
                variant="outline"
                size="icon-xs"
                aria-label={`Increase quantity of ${product.name}`}
                onClick={() => updateQty(line.id, 1)}
              >
                <Plus />
              </Button>
              <button
                type="button"
                aria-label={`Remove ${product.name} from cart`}
                onClick={() => {
                  remove(line.id);
                  toast(
                    `Removed ${product.name}`,
                    {
                      action: {
                        label: "Undo",
                        onClick: () => {
                          // Re-add the exact line that was removed (same mode/qty).
                          add(line.id, line.qty >= 10 ? "wholesale" : "unit" as PricingMode);
                          toast.success(`Undid — ${product.name}`);
                        },
                      },
                    },
                  );
                }}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-ink-low transition-colors hover:bg-bad-bg hover:text-bad"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
          <p className="flex-none font-mono text-[12.5px] font-semibold text-ink-hi">
            {formatNaira(lineTotal)}
          </p>
        </li>
      ))}
    </ul>

    <section className="mt-8">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
          You might also want
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1 font-mono text-[10px] text-volt-text transition-colors hover:text-volt">
          See full shop
          <ArrowRight className="size-3" />
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {relatedProducts().map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
    </>
  );
}