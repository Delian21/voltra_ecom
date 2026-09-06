import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Delivery address, payment method, and order confirmation — prototype.",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}