import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function CheckoutConfirmationNotFound() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-14 text-center">
      <div className="flex items-center justify-center gap-3">
        <AlertCircle className="size-8 text-warn" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
          Confirmation not found
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-hi md:text-4xl">
        We couldn&apos;t find that order
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-mid">
        This prototype confirmation only shows orders placed in this browser. If
        you followed a stale link, the order isn&apos;t here.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-lg border border-volt/60 bg-volt/10 px-5 py-2.5 text-sm font-semibold text-volt-text transition-colors hover:bg-volt/20"
        >
          Back to shop
        </Link>
        <Link
          href="/checkout"
          className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-mid transition-colors hover:border-ink-low hover:text-ink-hi"
        >
          Start checkout again
        </Link>
      </div>
    </div>
  );
}
