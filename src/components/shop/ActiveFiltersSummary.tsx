"use client";

import { X } from "lucide-react";
import type { SortOption } from "@/components/shop/ShopBrowser";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A–Z",
  stock: "Stock: high to low",
};

export interface ActiveFiltersSummaryProps {
  query: string;
  category: string;
  sort: SortOption;
  onClear: () => void;
  onRemoveCategory: () => void;
  onRemoveQuery: () => void;
  onRemoveSort: () => void;
}

function chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-bg2 px-2.5 py-1 text-xs text-ink-mid">
      {label}
      <button
        type="button"
        aria-label={`Remove ${label} filter`}
        onClick={onRemove}
        className="flex h-4 w-4 items-center justify-center rounded-full text-ink-low transition-colors hover:bg-bad-bg hover:text-bad focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

export function ActiveFiltersSummary({
  query,
  category,
  sort,
  onClear,
  onRemoveCategory,
  onRemoveQuery,
  onRemoveSort,
}: ActiveFiltersSummaryProps) {
  const chips = [
    query ? { label: `“${query}”`, onRemove: onRemoveQuery } : null,
    category && category !== "All"
      ? { label: category, onRemove: onRemoveCategory }
      : null,
    sort && sort !== "featured"
      ? { label: SORT_LABELS[sort], onRemove: onRemoveSort }
      : null,
  ].filter(Boolean);

  if (chips.length === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
        Filters active
      </p>
      {chips.map((c) => (
        <span key={c!.label}>{chip(c!)}</span>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="font-mono text-xs text-volt-text transition-colors hover:text-volt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
      >
        Clear filters
      </button>
    </div>
  );
}
