import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LightningBolt } from "./LightningBolt";

export function B2BBand() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-4">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-low">
        <span className="mr-3 text-volt-text">04</span>For the trade
      </p>
      <div
        className="relative overflow-hidden rounded-xl border border-line border-l-[3px] border-l-volt bg-bg1 p-8 md:p-12"
        style={{
          backgroundImage:
            "linear-gradient(160deg, rgba(198,255,62,0.07), rgba(16,19,26,0) 55%)",
        }}
      >
        {/* Small bolt accent — top-right corner of the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden md:block"
          style={{ width: "80px", height: "160px", opacity: "0.4", transform: "rotate(12deg)" }}
        >
          <LightningBolt />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-volt-text">
          For retailers · wholesale · trade credit · restock plans
        </p>
        <h2 className="mt-4 max-w-xl font-display text-2xl font-bold tracking-tight text-ink-hi md:text-3xl">
          Stock your shop without the guesswork.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-mid">
          Wholesale pricing from 10 units, trade credit on account, and
          restock plans that watch your stock so you never hear "it ran out"
          from a customer first.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/retailer">Apply for wholesale access</Link>
        </Button>
      </div>
    </section>
  );
}
