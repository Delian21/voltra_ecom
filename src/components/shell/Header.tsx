"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { CartSheet } from "@/components/cart/CartSheet";
import { RetailerStatusChip } from "@/components/shell/RetailerStatusChip";
import { AccountMenu } from "@/components/shell/AccountMenu";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Retailers", href: "/retailer" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  /** Section match: `/retailer` stays active on `/retailer/bulk` too. */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg0/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-3 px-5">
        <Link
          href="/"
          className="flex flex-none items-center gap-2.5"
          aria-label="Voltra home"
          onClick={closeMenu}
        >
          <LogoMark size={26} tone="two-tone" />
          <span className="font-display text-[19px] font-bold tracking-tight text-ink-hi">
            Voltra
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-sm transition-colors ${
                  active
                    ? "text-ink-hi after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-volt"
                    : "text-ink-mid hover:text-ink-hi"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <RetailerStatusChip />
          <AccountMenu />
          <CartSheet />
        </nav>

        {/* Mobile: cart + menu toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <CartSheet />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-bg1 text-ink-mid transition-colors hover:border-volt hover:text-ink-hi"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — portaled so the header's backdrop-blur can't become
          its containing block and clip it to the header strip. */}
      {menuOpen &&
        createPortal(
          <div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-16 z-40 sm:hidden"
          >
            <div
              aria-hidden
              onClick={closeMenu}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs animate-in fade-in-0 duration-200"
            />
            <div className="absolute inset-x-0 top-0 border-b border-line bg-bg0/95 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 ease-out duration-200">
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-lg px-2 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-bg2 text-ink-hi"
                          : "text-ink-mid hover:bg-bg2 hover:text-ink-hi"
                      }`}
                    >
                      {l.label}
                      {active && (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-volt"
                        />
                      )}
                    </Link>
                  );
                })}
                <div className="my-2 h-px bg-line" />
                <div className="flex items-center justify-between gap-3 px-2 py-2">
                  <RetailerStatusChip />
                </div>
                <div className="px-2 py-2">
                  <AccountMenu />
                </div>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
