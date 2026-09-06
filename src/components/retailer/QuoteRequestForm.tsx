"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuotes } from "@/lib/store/quotes";
import { waLink, quoteWhatsAppText } from "@/lib/whatsapp";
import { formatNaira } from "@/components/product/PriceTag";
import type { Product, QuoteLine } from "@/lib/types";

const EYEBROW =
  "font-mono text-[10px] uppercase tracking-[0.16em] text-volt-text";
const LABEL =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low";
const FIELD =
  "h-10 w-full rounded-lg border border-line-strong bg-bg2 px-3 text-sm text-ink-hi outline-none transition-colors placeholder:text-ink-low focus-visible:border-volt focus-visible:ring-3 focus-visible:ring-volt/50";
const FIELD_INVALID =
  "border-bad focus-visible:border-bad focus-visible:ring-bad/30";

export function QuoteRequestForm({ products }: { products: Product[] }) {
  const draft = useQuotes((s) => s.draft);
  const setQty = useQuotes((s) => s.setQty);
  const submit = useQuotes((s) => s.submit);
  const submission = useQuotes(
    (s) => s.submissions[0] ?? null,
  );

  const [company, setCompany] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{
    company?: string;
    whatsapp?: string;
    lines?: string;
  }>({});

  const lines: QuoteLine[] = products
    .filter((p) => (draft[p.id] ?? 0) > 0)
    .map((p) => ({
      productId: p.id,
      name: p.name,
      wholesale: p.wholesale,
      qty: draft[p.id],
    }));
  const totalUnits = lines.reduce((n, l) => n + l.qty, 0);
  const estValue = lines.reduce((n, l) => n + l.qty * l.wholesale, 0);

  const handleSubmit = () => {
    const next: typeof errors = {};
    if (!company.trim()) next.company = "Add your business name";
    if (!/^\+?[\d\s()-]{7,}$/.test(whatsapp.trim()))
      next.whatsapp = "Add a valid WhatsApp number";
    if (lines.length === 0) next.lines = "Add at least one product";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    submit(
      { company: company.trim(), whatsapp: whatsapp.trim(), notes: notes.trim() },
      lines,
    );
    toast.success("Quote request sent — we'll reply on WhatsApp");
  };

  if (submission) {
    return <SubmittedScreen submission={submission} />;
  }

  return (
    <div className="rounded-xl border border-line bg-bg1 p-6 md:p-8">
      <p className={EYEBROW}>Request a quote · RFQ</p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-hi">
        Build your wholesale quote
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-ink-mid">
        Set quantities per SKU — pricing shows wholesale rates. Send it here and
        we reply on WhatsApp, or hand the list straight to our team there.
      </p>

      {/* Itemized lines */}
      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg0">
        {products.map((p) => {
          const qty = draft[p.id] ?? 0;
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-ink-hi">
                  {p.name}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-low">
                  {formatNaira(p.wholesale)} / unit · min 10
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Remove one ${p.name} from quote`}
                  onClick={() => setQty(p.id, Math.max(0, qty - 10))}
                  className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-mid transition-colors hover:border-ink-low hover:text-ink-hi"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={qty === 0 ? "" : qty}
                  placeholder="0"
                  aria-label={`Quantity for ${p.name}`}
                  onChange={(e) =>
                    setQty(p.id, Math.max(0, Math.floor(Number(e.target.value) || 0)))
                  }
                  className="h-8 w-16 rounded-lg border border-line-strong bg-bg2 text-center font-mono text-[13px] text-ink-hi outline-none focus-visible:border-volt"
                />
                <button
                  type="button"
                  aria-label={`Add ten ${p.name} to quote`}
                  onClick={() => setQty(p.id, qty + 10)}
                  className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-mid transition-colors hover:border-ink-low hover:text-ink-hi"
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {lines.length === 0 ? (
        <p className="mt-2 text-xs text-bad" role="alert">
          {errors.lines ?? "Quantities step by 10 · nothing added yet"}
        </p>
      ) : (
        <p className="mt-2 font-mono text-[10.5px] text-ink-low">
          {`${lines.length} SKU${lines.length === 1 ? "" : "s"} · ${totalUnits} units · est. ${formatNaira(estValue)} (final quote confirmed on WhatsApp)`}
        </p>
      )}

      {/* Contact details */}
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rq-company" className={LABEL}>
            Business name
          </label>
          <input
            id="rq-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Emeka Electronics"
            aria-invalid={Boolean(errors.company)}
            className={`${FIELD} ${errors.company ? FIELD_INVALID : ""}`}
          />
          {errors.company ? (
            <p className="mt-1.5 text-xs text-bad" role="alert">
              {errors.company}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="rq-whatsapp" className={LABEL}>
            WhatsApp number
          </label>
          <input
            id="rq-whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="e.g. 0801 234 5678"
            aria-invalid={Boolean(errors.whatsapp)}
            className={`${FIELD} ${errors.whatsapp ? FIELD_INVALID : ""}`}
          />
          {errors.whatsapp ? (
            <p className="mt-1.5 text-xs text-bad" role="alert">
              {errors.whatsapp}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="rq-notes" className={LABEL}>
          Notes (optional)
        </label>
        <textarea
          id="rq-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Delivery city, target date, packaging preferences..."
          className={`${FIELD} h-auto py-2.5`}
        />
      </div>

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <Button className="sm:flex-1" onClick={handleSubmit}>
          Send quote request
        </Button>
        <Button
          variant="outline"
          className="sm:flex-1"
          disabled={lines.length === 0}
          onClick={() => {
            window.open(
              waLink(
                quoteWhatsAppText({
                  company: company.trim() || "a retailer",
                  lines,
                  notes: notes.trim() || undefined,
                }),
              ),
              "_blank",
              "noopener,noreferrer",
            );
          }}
        >
          <MessageCircle data-icon="inline-start" />
          Continue on WhatsApp
        </Button>
      </div>
      <p className="mt-4 font-mono text-[10.5px] leading-5 text-ink-low">
        Prototype flow — requests live in this browser only. In production both
        buttons reach the Voltra trade desk; the WhatsApp option opens a chat
        with your item list prefilled.
      </p>
    </div>
  );
}

function SubmittedScreen({
  submission,
}: {
  submission: NonNullable<ReturnType<typeof useQuotes.getState>["submissions"][number]>;
}) {
  return (
    <div className="rounded-xl border border-line bg-bg1 p-6 md:p-8">
      <p className={EYEBROW}>Request a quote · RFQ</p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-hi">
        Quote request received
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-ink-mid">
        Thanks, {submission.company}. Your reference is{" "}
        <span className="font-mono text-volt-text">{submission.id}</span> — the
        trade desk replies to {submission.whatsapp} on WhatsApp, usually within
        a few hours.
      </p>

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line">
        {submission.lines.map((l) => (
          <li key={l.productId} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 truncate text-[13.5px] text-ink-hi">
              {l.name}
            </span>
            <span className="flex-none font-mono text-[12px] text-ink-mid">
              × {l.qty} · {formatNaira(l.qty * l.wholesale)}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={waLink(
          quoteWhatsAppText({
            company: submission.company,
            lines: submission.lines,
            notes: submission.notes || undefined,
          }),
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-line-strong px-4 py-2.5 text-sm font-medium text-ink-hi transition-colors hover:border-volt hover:text-volt-text"
      >
        <MessageCircle className="size-4" />
        Continue on WhatsApp
      </a>
      <p className="mt-4 font-mono text-[10.5px] leading-5 text-ink-low">
        The same item list opens in WhatsApp, prefilled — quotes are finalized
        in the chat.
      </p>
    </div>
  );
}
