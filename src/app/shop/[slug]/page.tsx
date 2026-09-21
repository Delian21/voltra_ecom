import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductSync } from "@/lib/data/catalog.shared";
import { PriceTag } from "@/components/product/PriceTag";
import { StockPill } from "@/components/product/StockPill";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { InTheBox } from "@/components/product/InTheBox";
import { SpecsAccordion } from "@/components/product/SpecsAccordion";
import { SpecsSkeleton } from "@/components/product/SpecsSkeleton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductSync(slug);
  const loading = false;

  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-volt-text transition-colors hover:text-volt"
      >
        <ArrowLeft className="size-3.5" /> Back to shop
      </Link>

      <div className="mt-7 grid gap-10 md:grid-cols-2">
        <ProductGallery product={product} />

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-volt-text">
            {product.category}
          </p>
          <h1 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-ink-hi md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-ink-mid">{product.meta}</p>
          <p className="mt-5 text-[14px] leading-7 text-ink-mid">
            {product.desc}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-line py-5">
            <PriceTag amount={product.price} className="text-2xl" />
            <StockPill stock={product.stock} className="px-2.5 py-1 text-[10px]" />
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-low">
            Wholesale {formatWholesale(product.wholesale)} from 10 units
          </p>

          {/* Trust signals */}
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-bg2 px-3 py-1.5 text-xs text-ink-mid">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Direct-sourced from manufacturer
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-bg2 px-3 py-1.5 text-xs text-ink-mid">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              6-month warranty on all units
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-bg2 px-3 py-1.5 text-xs text-ink-mid">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3z" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
              14-day returns — unused, original pack
            </span>
          </div>

          <InTheBox product={product} />

          <ProductActions product={product} />

          {loading ? (
            <SpecsSkeleton />
          ) : (
            <SpecsAccordion specs={product.specs} />
          )}
        </div>
      </div>
    </div>
  );
}

function formatWholesale(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}
