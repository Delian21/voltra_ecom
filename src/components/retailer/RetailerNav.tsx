"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Dashboard", href: "/retailer" },
  { label: "Bulk order", href: "/retailer/bulk" },
  { label: "Request quote", href: "/retailer/quote" },
  { label: "Restock plan", href: "/retailer/restock" },
] as const;

export function RetailerNav() {
  const pathname = usePathname();

  return (
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-volt-text">
        Retailer console · B2B
      </p>
      <nav className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active =
            tab.href === "/retailer"
              ? pathname === "/retailer"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                active
                  ? "bg-volt text-volt-ink"
                  : "text-ink-mid hover:bg-bg2 hover:text-ink-hi",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}