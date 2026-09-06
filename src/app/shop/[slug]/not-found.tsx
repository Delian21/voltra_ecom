import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-24 text-center md:py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warn">
        Product not found
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-hi">
        We don&apos;t carry that one.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-mid">
        That product slug doesn&apos;t match anything in the catalog — it may
        have been renamed, delisted, or mistyped.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs text-volt-text transition-colors hover:text-volt"
      >
        <ArrowLeft className="size-3.5" /> Back to the full catalog
      </Link>
    </div>
  );
}
