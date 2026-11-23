"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** Submits to the shop page's existing `q` filter; no new search logic. */
export function HeaderSearch({
  onNavigate,
  className = "",
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        onNavigate?.();
        router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
        setQuery("");
      }}
      className={`relative ${className}`}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-low" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className="h-9 w-full rounded-full border border-line-strong bg-bg1 pl-9 pr-3 text-[13px] text-ink-hi outline-none transition-colors placeholder:text-ink-low focus:border-volt"
      />
    </form>
  );
}
