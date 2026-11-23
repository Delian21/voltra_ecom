import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatermarkBolt } from "./LightningBolt";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px,28px_28px] [mask-image:linear-gradient(to_bottom,black_52%,transparent_97%)]"
      />
      {/* Ambient wash behind the top of the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-volt/10 blur-[120px]"
        style={{ opacity: "calc(0.45 + 0.55 * var(--bolt-opacity, 0.5))" }}
      />
      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-10 px-5 pb-14 pt-14 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:pb-24 md:pt-28">
        {/* Bolt — above the headline on mobile, the right-hand column on desktop. */}
        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          <div
            aria-hidden
            className="hero-bolt-float w-[140px] md:aspect-[3/8] md:h-[clamp(380px,42vw,560px)] md:w-auto [&>svg]:h-auto [&>svg]:w-full md:[&>svg]:size-full"
            style={{
              filter:
                "drop-shadow(0 0 24px rgba(198,255,62,0.55)) drop-shadow(0 0 90px rgba(198,255,62,0.25))",
            }}
          >
            <WatermarkBolt />
          </div>
        </div>

        <div className="relative z-10 order-2 md:order-1">
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
              <Link href="/shop">
                Shop the catalog
                <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              style={{
                boxShadow: "0 0 calc(20px * var(--bolt-opacity, 0.5)) rgba(198,255,62,0.16)",
              }}
            >
              <Link href="/retailer">
                For retailers
                <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 md:mt-8">
            {["Ready to ship", "Fair prices, always"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-[12.5px] text-ink-mid"
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-volt shadow-[0_0_8px_rgba(198,255,62,0.75)]"
                />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
