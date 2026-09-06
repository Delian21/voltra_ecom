"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { useCartSummary, buyerDisplayName } from "@/components/cart/useCartSummary";
import { formatNaira } from "@/components/product/PriceTag";
import { recordOrder } from "@/lib/data/orders";

const SAMPLE_LINES = [
  {
    id: "sample-1",
    name: "Voltra BP-01 backup power unit",
    qty: 1,
    unitPrice: 89000,
    mode: "unit" as const,
    total: 89000,
  },
  {
    id: "sample-2",
    name: "Voltra solar lantern (wholesale pack of 10)",
    qty: 1,
    unitPrice: 42000,
    mode: "wholesale" as const,
    total: 42000,
  },
  {
    id: "sample-3",
    name: "Voltra USB-C charging cable",
    qty: 2,
    unitPrice: 3500,
    mode: "unit" as const,
    total: 7000,
  },
] as const;

const SAMPLE_TOTAL = 138000;

const PAYMENT_METHODS = [
  { id: "paystack", name: "Paystack", note: "Card, transfer & USSD" },
  { id: "flutterwave", name: "Flutterwave", note: "Card, bank & mobile money" },
  { id: "cash", name: "Cash / POS on delivery", note: "Pay when it arrives" },
] as const;

type PaymentId = (typeof PAYMENT_METHODS)[number]["id"];

function describeLine({
  product,
  line,
  unitPrice,
}: {
  product: { name: string };
  line: { qty: number; mode: "unit" | "wholesale" };
  unitPrice: number;
}) {
  const mode = line.mode === "wholesale" ? "wholesale" : "";
  return `${line.qty} × ${product.name}${mode ? ` (${formatNaira(unitPrice)}/unit, wholesale)` : ` (${formatNaira(unitPrice)})`}`;
}

export function CheckoutPage() {
  const router = useRouter();
  const { items, count, total } = useCartSummary();
  const clear = useCart((s) => s.clear);
  const [payment, setPayment] = useState<PaymentId>("paystack");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const placeOrder = () => {
    if (!fullName.trim() || !phone.trim()) {
      toast("Add a delivery address first");
      return;
    }

    const buyer = buyerDisplayName();
    const order = recordOrder({
      buyer: buyer ?? phone.trim(),
      items: items.map(describeLine).join(", "),
      total,
      status: "Received",
    });

    clear();
    router.push(`/checkout/confirmation?order=${order.id}`);
  };

  if (total === 0) {
    return (
      <div className="mx-auto w-full max-w-[1180px] px-5 py-24">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
            Checkout
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-hi md:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-3 max-w-md text-sm text-ink-mid">
            Add a few things first — checkout shows your delivery address, payment
            method, and order summary.
          </p>

          <div className="mt-9 rounded-xl border border-line bg-bg1 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              What checkout looks like
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {SAMPLE_LINES.map((line) => (
                <li key={line.id} className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-ink-hi">{line.name}</span>
                    <span className="font-mono text-[10px] text-ink-low">
                      {line.qty} × {formatNaira(line.unitPrice)}
                      {line.mode === "wholesale" ? " (wholesale)" : ""}
                    </span>
                  </span>
                  <span className="flex-none font-mono text-xs text-ink-mid">
                    {formatNaira(line.total)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm text-ink-mid">Sample order total</span>
              <span className="font-mono text-lg font-semibold text-ink-hi">
                {formatNaira(SAMPLE_TOTAL)}
              </span>
            </div>
          </div>

          <Button asChild className="mt-6">
            <Link href="/shop">Browse the shop</Link>
          </Button>
          <p className="mt-3 font-mono text-[10.5px] text-ink-low">
            Prototype — nothing is charged. Real checkout comes with the backend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-volt-text transition-colors hover:text-volt"
      >
        <ArrowLeft className="size-3.5" /> Back to cart
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-hi md:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 font-mono text-[10.5px] text-ink-low">
        Prototype — orders won’t be placed until the backend phase.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section className="rounded-xl border border-line bg-bg1 p-6">
            <div className="mb-5 flex items-center gap-2">
              <MapPin className="size-4 text-ink-low" />
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
                Delivery address
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="co-name"
                  className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low"
                >
                  Full name
                </label>
                <Input
                  id="co-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ada Obi"
                  className="h-10 bg-bg2 text-sm text-ink-hi"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="co-phone"
                  className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low"
                >
                  Phone
                </label>
                <Input
                  id="co-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0803 000 0000"
                  className="h-10 bg-bg2 text-sm text-ink-hi"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="co-address"
                  className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low"
                >
                  Street address
                </label>
                <Input
                  id="co-address"
                  placeholder="House number, street, area"
                  className="h-10 bg-bg2 text-sm text-ink-hi"
                />
              </div>
              <div>
                <label
                  htmlFor="co-city"
                  className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low"
                >
                  City
                </label>
                <Input
                  id="co-city"
                  placeholder="e.g. Lagos"
                  className="h-10 bg-bg2 text-sm text-ink-hi"
                />
              </div>
              <div>
                <label
                  htmlFor="co-state"
                  className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low"
                >
                  State
                </label>
                <Input
                  id="co-state"
                  placeholder="e.g. Lagos"
                  className="h-10 bg-bg2 text-sm text-ink-hi"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-line bg-bg1 p-6">
            <div className="mb-5 flex items-center gap-2">
              <CreditCard className="size-4 text-ink-low" />
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
                Payment method
              </h2>
            </div>
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((m) => {
                const active = payment === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayment(m.id)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3.5 text-left transition-colors ${
                      active
                        ? "border-volt bg-volt/10"
                        : "border-line-strong bg-bg2 hover:border-ink-low"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          active ? "text-volt-text" : "text-ink-hi"
                        }`}
                      >
                        {m.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-ink-low">
                        {m.note}
                      </p>
                    </div>
                    <span
                      className={`h-3.5 w-3.5 flex-none rounded-full border ${
                        active
                          ? "border-volt bg-volt"
                          : "border-ink-low"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-line bg-bg1 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
            Order summary
          </p>
          <ul className="mt-4 space-y-3 border-b border-line pb-4">
            {items.map(({ line, product, unitPrice, lineTotal }) => (
              <li key={line.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate text-ink-hi">
                    {product.name}
                  </span>
                  <span className="font-mono text-[10px] text-ink-low">
                    {line.qty} × {formatNaira(unitPrice)}
                    {line.mode === "wholesale" ? " (wholesale)" : ""}
                  </span>
                </span>
                <span className="flex-none font-mono text-xs text-ink-mid">
                  {formatNaira(lineTotal)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-ink-mid">
              Total · {count} item{count === 1 ? "" : "s"}
            </span>
            <span className="font-mono text-lg font-semibold text-ink-hi">
              {formatNaira(total)}
            </span>
          </div>
          <Button className="mt-5 w-full hidden sm:block" onClick={placeOrder}>
            Place order — prototype
          </Button>
          <p className="mt-3 text-center text-[11px] text-ink-low">
            This prototype stops before real payment, on purpose.
          </p>
        </aside>

        {/* Sticky mobile checkout bar — mirrors the cart page footer */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-bg0/95 backdrop-blur-sm sm:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-ink-low">Total</span>
              <span className="font-mono text-lg font-semibold text-ink-hi">
                {formatNaira(total)}
              </span>
            </div>
            <Button
              className="flex-1"
              onClick={placeOrder}
              disabled={!fullName.trim() || !phone.trim()}
            >
              Place order — prototype
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}