import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LightningBolt } from "./LightningBolt";

export function Hero({ product }: { product: Product }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px,28px_28px] [mask-image:linear-gradient(to_bottom,black_52%,transparent_97%)]"
      />
      {/* Glow blob — breathes with the bolt via the root --bolt-opacity var
          that LightningBolt's RAF clock exports every frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-volt/10 blur-[120px]"
        style={{ opacity: "calc(0.45 + 0.55 * var(--bolt-opacity, 0.5))" }}
      />
      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-10 px-5 pb-14 pt-14 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:pb-24 md:pt-28">
        <div className="relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] leading-relaxed text-volt-text sm:text-[11px] sm:tracking-[0.22em]">
            Voltra · power banks · earbuds · chargers
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.025em] text-ink-hi md:text-6xl">
            Always on.
            <br />
            Never out.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-mid">
            Electronics that show up when you need them — direct-sourced,
            fair-priced, and stocked deep enough that “out of stock" is
            somebody else’s problem.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 md:mt-10">
            <Button
              asChild
              size="lg"
              style={{
                boxShadow: "0 0 calc(28px * var(--bolt-opacity, 0.5)) rgba(198,255,62,0.30)",
              }}
            >
              <Link href="/shop">Shop the catalog</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              style={{
                boxShadow: "0 0 calc(20px * var(--bolt-opacity, 0.5)) rgba(198,255,62,0.16)",
              }}
            >
              <Link href="/retailer">For retailers</Link>
            </Button>
          </div>
        </div>

        {/* Featured product — sits below the copy on mobile, beside it on desktop. */}
        <div className="relative mx-auto w-full max-w-[400px] md:max-w-[480px]">
          {/* Faint bolt accent, tucked behind the product tile (never behind the headline). */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 z-0 h-[200px] w-[100px] rotate-12 opacity-20 md:-right-10 md:-top-14 md:h-[360px] md:w-[180px] md:opacity-25"
          >
            <LightningBolt mode="calm" />
          </div>
          {/* Soft lime glow behind the product. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 bottom-4 top-10 z-0 rounded-full bg-volt/20 blur-[80px] md:inset-x-8 md:blur-[110px]"
          />
          <div className="relative z-10 overflow-hidden rounded-2xl border border-line bg-bg1">
            <Image
              src={product.image}
              alt={product.name}
              priority
              placeholder="blur"
              sizes="(min-width: 768px) 480px, 90vw"
              className="aspect-[4/3] w-full object-contain p-5 md:p-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
}