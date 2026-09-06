"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/product/ProductCard";
import { ActiveFiltersSummary } from "@/components/shop/ActiveFiltersSummary";
import type { Product } from "@/lib/types";

export type SortOption = "featured" | "price-asc" | "price-desc" | "name" | "stock";

function sortProducts(items: Product[], sort: SortOption): Product[] {
  return [...items].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "stock":
        return b.stock - a.stock;
      default:
        return 0;
    }
  });
}

/**
 * Filters live in component state for instant typing, and mirror into the
 * URL (/shop?q=…&category=…&sort=…) so filtered views are shareable and
 * refresh-stable. The URL is written with history.replaceState — no router
 * navigation per keystroke — and the initial values arrive from the server
 * via searchParams, so SSR and first client render always agree.
 */
export function ShopBrowser({
  products,
  categories,
  initialCategory = "All",
  initialQuery = "",
  initialSort = "featured",
}: {
  products: Product[];
  categories: string[];
  initialCategory?: string;
  initialQuery?: string;
  initialSort?: SortOption;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortOption>(initialSort);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "All") params.set("category", category);
    if (sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/shop?${qs}` : "/shop");
  }, [query, category, sort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = products.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQ =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.meta.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    return sortProducts(items, sort);
  }, [products, query, category, sort]);

  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 py-12">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-volt-text">
          The catalog · always stocked
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-hi md:text-4xl">
          Shop
        </h1>
        <p className="mt-2 text-sm text-ink-mid">
          Search the aisles, or filter by category.
        </p>
      </header>

      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-low" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search power banks, earbuds, cables..."
          aria-label="Search products"
          className="h-10 rounded-full border-line-strong bg-bg1 pl-10 text-sm text-ink-hi placeholder:text-ink-low"
        />
      </div>

      <ActiveFiltersSummary
        query={query}
        category={category}
        sort={sort}
        onClear={() => {
          setQuery("");
          setCategory("All");
          setSort("featured");
        }}
        onRemoveQuery={() => setQuery("")}
        onRemoveCategory={() => setCategory("All")}
        onRemoveSort={() => setSort("featured")}
      />

      <div className="mb-8 flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              category === c
                ? "border-volt bg-volt/10 text-volt-text"
                : "border-line-strong bg-bg1 text-ink-mid hover:border-ink-low hover:text-ink-hi"
            }`}
          >
            {c}
          </button>
        ))}
        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="h-7 border-line-strong bg-bg1 pl-8 pr-7 text-xs text-ink-hi [&>span]:text-ink-hi">
            <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-low" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="name">Name: A–Z</SelectItem>
            <SelectItem value="stock">Stock: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-low">
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="border-t border-line py-20 text-center">
          <p className="mx-auto max-w-md text-[14px] leading-6 text-ink-mid">
            No matches for “{query.trim()}”. Try another search — or browse
            the aisles.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-6 font-mono text-xs text-volt-text transition-colors hover:text-volt"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
