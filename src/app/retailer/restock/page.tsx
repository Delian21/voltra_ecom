import type { Metadata } from "next";
import { listProducts } from "@/lib/data/catalog";
import { RestockPlanForm } from "@/components/retailer/RestockPlanForm";

export const metadata: Metadata = {
  title: "Restock plan",
  description: "Set-and-forget restock plans for tracked SKUs.",
};

export default async function RestockPlanPage() {
  const products = await listProducts();
  return <RestockPlanForm products={products} />;
}