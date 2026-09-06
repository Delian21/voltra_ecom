import type { Metadata } from "next";
import { listProducts } from "@/lib/data/catalog";
import { BulkCatalog } from "@/components/retailer/BulkCatalog";

export const metadata: Metadata = {
  title: "Bulk order",
  description: "Wholesale ordering at minimum 10 units per SKU.",
};

export default async function BulkOrderPage() {
  const products = await listProducts();
  return <BulkCatalog products={products} />;
}