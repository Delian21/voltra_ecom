import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="relative mx-auto w-full max-w-[1180px] px-5 py-20 overflow-hidden">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-volt-text">
            <span className="mr-3 text-ink-low">03</span>Fresh this week
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink-hi">
            Featured products
          </h2>
          <p className="mt-2 max-w-md text-[13.5px] leading-6 text-ink-mid">
            Four picks from this week&apos;s drop — in stock and ready to ship.
          </p>
        </div>
        <Link
          href="/shop"
          className="font-mono text-xs text-volt-text transition-colors hover:text-volt"
        >
          Browse the full catalog →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}