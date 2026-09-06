"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useRetailer } from "@/lib/store/retailer";

const CONSOLE_LINKS = [
  { label: "Dashboard", href: "/retailer" },
  { label: "Bulk order", href: "/retailer/bulk" },
  { label: "Restock plan", href: "/retailer/restock" },
] as const;

const LINK_STATES = {
  none: {
    label: "Apply",
    className: "border-volt/60 text-volt-text hover:bg-volt/10",
  },
  applied: {
    label: "Pending",
    className: "border-warn/50 text-warn",
  },
  rejected: {
    label: "Apply",
    className: "border-volt/60 text-volt-text hover:bg-volt/10",
  },
} as const;

export function RetailerStatusChip() {
  const status = useRetailer((s) => s.status);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const prev = useRef(status);

  // Surface status transitions from anywhere (the header is on every page),
  // so an approval is never silent — including approvals that won't come from
  // the applicant's own button once a real admin side exists. First render
  // never toasts (a persisted "approved" is not a change).
  useEffect(() => {
    if (prev.current === status) return;
    prev.current = status;
    if (status === "approved") {
      toast.success("Welcome to Voltra wholesale — your account is live");
    } else if (status === "rejected") {
      toast("Application declined");
    }
  }, [status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (status === "approved") {
    return (
      <div className="relative">
        <button
          type="button"
          aria-label="Retailer status: Approved"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 rounded-full border border-good/50 px-2.5 py-1 font-mono text-[10px] font-semibold text-good transition-colors hover:bg-good/10"
        >
          Approved
          <ChevronDown
            className={`size-2.5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <>
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40"
            />
            <div
              role="menu"
              aria-label="Retailer console"
              className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-bg1 py-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
            >
              <p className="px-3 pb-1.5 pt-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-low">
                Retailer console
              </p>
              {CONSOLE_LINKS.map((l) => {
                const active =
                  l.href === "/retailer"
                    ? pathname === "/retailer"
                    : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 text-[12.5px] transition-colors hover:bg-bg2 ${
                      active ? "text-volt-text" : "text-ink-hi"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  const s = LINK_STATES[status];

  return (
    <Link
      href="/retailer"
      aria-label={`Retailer status: ${s.label}`}
      className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold transition-colors ${s.className}`}
    >
      {s.label}
    </Link>
  );
}