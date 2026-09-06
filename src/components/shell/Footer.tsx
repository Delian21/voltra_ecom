import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { IMAGE_CREDIT_NAMES } from "@/lib/data/imageCredits";

const LINK_COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Power banks", href: "/shop?category=Power%20Banks" },
      { label: "Earphones", href: "/shop?category=Earphones" },
      { label: "Accessories", href: "/shop?category=Accessories" },
    ],
  },
  {
    title: "Retailers",
    links: [
      { label: "Dashboard", href: "/retailer" },
      { label: "Bulk order", href: "/retailer/bulk" },
      { label: "Restock plans", href: "/retailer/restock" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "WhatsApp support", href: "#support" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg0">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={22} tone="two-tone" />
            <span className="font-display text-[17px] font-bold tracking-tight text-ink-hi">
              Voltra
            </span>
          </div>
          <p className="mt-3 max-w-[240px] text-[13px] leading-6 text-ink-mid">
            Always on. Never out. Reliable gadgets, priced fair, in stock when
            you need them.
          </p>
        </div>
        {LINK_COLS.map((col) => (
          <div key={col.title}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-ink-mid transition-colors hover:text-ink-hi"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-2 px-5 py-4 font-mono text-[10.5px] text-ink-low">
          <span>© 2026 Voltra · Lagos, Nigeria</span>
          {/* DEMO IMAGERY credit — remove with imageCredits.ts once original
              product photos replace the Pexels placeholders. */}
          <span>
            Demo photos: Pexels —{" "}
            {IMAGE_CREDIT_NAMES.slice(0, 5).join(", ")} & others
          </span>
          <span>Sample data — prototype</span>
        </div>
      </div>
    </footer>
  );
}