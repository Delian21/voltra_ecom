import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { formatNaira } from "@/components/product/PriceTag";
import { listMockOrders } from "@/lib/data/orders";

export const metadata: Metadata = {
  title: "Order confirmed",
  description:
    "Your Voltra order is received — prototype confirmation for the mock phase.",
};

export default async function CheckoutConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;

  if (!orderId) notFound();

  const orders = listMockOrders();
  const placed = orders.find((o) => o.id === orderId);

  if (!placed) notFound();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-14 text-center">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-volt-text transition-colors hover:text-volt"
      >
        <ArrowLeft className="size-3.5" /> Back to shop
      </Link>

      <div className="mt-9 flex items-center justify-center gap-3">
        <CheckCircle className="size-8 text-good" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
          Order received
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-hi md:text-4xl">
        Thanks — your order is in
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-mid">
        We received your order. This is a prototype confirmation — the payment
        backend comes later, but your cart is cleared and the order is recorded
        in this browser for now.
      </p>

      <p className="mt-1 text-xs text-ink-low">
        Order {placed.id} — {placed.items}
      </p>

      <div className="mt-9 rounded-xl border border-line bg-bg1 p-6 text-left md:p-8">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              Order
            </dt>
            <dd className="mt-1 font-mono text-lg font-semibold text-ink-hi">
              {placed.id}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              Date
            </dt>
            <dd className="mt-1 font-mono text-sm text-ink-hi">{placed.date}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              Items
            </dt>
            <dd className="mt-1 text-sm text-ink-hi">{placed.items}</dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              Status
            </dt>
            <dd className="mt-1 font-mono text-sm text-good">{placed.status}</dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              Buyer
            </dt>
            <dd className="mt-1 font-mono text-sm text-ink-hi">
              {placed.buyer ?? "Guest checkout"}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              Total
            </dt>
            <dd className="mt-1 font-mono text-xl font-semibold text-ink-hi">
              {formatNaira(placed.total)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-lg border border-volt/60 bg-volt/10 px-5 py-2.5 text-sm font-semibold text-volt-text transition-colors hover:bg-volt/20"
        >
          Continue shopping
        </Link>
        <Link
          href="/cart"
          className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-mid transition-colors hover:border-ink-low hover:text-ink-hi"
        >
          View cart
        </Link>
      </div>

      <p className="mt-8 font-mono text-[10.5px] text-ink-low">
        Prototype order confirmation only — no real payment has been taken.
      </p>
    </div>
  );
}
