import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LightningBolt, WatermarkBolt } from "./LightningBolt";

export function Hero() {
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
      {/* Lightning bolt — diagonal from top-right toward middle, with offset layer.
          Mobile gets a smaller, dimmer cut-down version peeking from the corner;
          it is the brand mark and most visitors arrive on phones. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 block h-[265px] w-[132px] opacity-60 md:h-[560px] md:w-[280px] md:opacity-100"
        style={{ transform: "rotate(12deg)" }}
      >
        <LightningBolt />
      </div>
      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-28 pt-16 md:pb-36 md:pt-28">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-volt-text">
          Voltra · power banks · earbuds · chargers
        </p>
        {/* Faint bolt watermark behind title */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 hidden md:block"
          style={{ width: "80px", height: "150px", opacity: "0.06" }}
        >
          <WatermarkBolt />
        </div>
        <h1 className="relative z-10 max-w-2xl font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.025em] text-ink-hi md:text-6xl">
          Always on.
          <br />
          Never out.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-7 text-ink-mid">
          Electronics that show up when you need them — direct-sourced,
          fair-priced, and stocked deep enough that “out of stock" is
          somebody else’s problem.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
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
    </section>
  );
}