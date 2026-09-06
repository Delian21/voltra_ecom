import type { Metadata } from "next";
import { listProducts } from "@/lib/data/catalog";
import { QuoteRequestForm } from "@/components/retailer/QuoteRequestForm";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Build an itemized wholesale quote and send it to the Voltra trade desk — or continue on WhatsApp with the list prefilled.",
};

export default async function QuoteRequestPage() {
  const products = await listProducts();
  return <QuoteRequestForm products={products} />;
}
