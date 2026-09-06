import { listProducts } from "@/lib/data/catalog";
import { Hero } from "@/components/landing/Hero";
import { AudienceCards } from "@/components/landing/AudienceCards";
import { TrustBar } from "@/components/landing/TrustBar";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { B2BBand } from "@/components/landing/B2BBand";

export default async function HomePage() {
  const products = await listProducts();

  return (
    <>
      <Hero />
      <AudienceCards />
      <TrustBar />
      <FeaturedProducts products={products.slice(0, 4)} />
      <B2BBand />
    </>
  );
}