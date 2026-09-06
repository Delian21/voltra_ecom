import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    eyebrow: "Consumer",
    title: "Shopping for myself",
    body: "Power banks, earbuds, chargers — buy units at retail, shipped fast.",
    cta: "Shop now",
    href: "/shop",
  },
  {
    eyebrow: "Retailer",
    title: "I run a shop",
    body: "Wholesale from 10 units, trade credit, and restock plans that watch your stock.",
    cta: "Apply for access",
    href: "/retailer",
  },
] as const;

export function AudienceCards() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 py-20">
      <div className="mb-9 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-volt-text">
          <span className="mr-3 text-ink-low">01</span>Pick your lane
        </h2>
        <p className="text-[13px] text-ink-low">Two journeys, one catalog.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.eyebrow}
            href={c.href}
            className="group block rounded-xl border border-line bg-bg1 p-7 transition-colors hover:border-volt hover:bg-bg2"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-volt-text">
              {c.eyebrow}
            </p>
            <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-ink-hi">
              {c.title}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-mid">
              {c.body}
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-volt-text transition-transform group-hover:translate-x-0.5">
              {c.cta} <ArrowRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}