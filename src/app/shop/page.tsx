import type { Metadata } from "next";
import { listCategories, listProducts } from "@/lib/data/catalog";
import { ShopBrowser, type SortOption } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Power banks, earbuds, chargers and accessories — always in stock, priced straight.",
};

const SORT_OPTIONS: readonly SortOption[] = [
  "featured",
  "price-asc",
  "price-desc",
  "name",
  "stock",
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const [{ category, q, sort }, products, categories] = await Promise.all([
    searchParams,
    listProducts(),
    listCategories(),
  ]);

  return (
    <ShopBrowser
      products={products}
      categories={categories}
      initialCategory={category ?? "All"}
      initialQuery={q ?? ""}
      initialSort={
        SORT_OPTIONS.includes(sort as SortOption)
          ? (sort as SortOption)
          : "featured"
      }
    />
  );
}
