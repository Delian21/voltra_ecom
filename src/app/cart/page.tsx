import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your Voltra cart — units and wholesale lines.",
};

export default function CartRoute() {
  return <CartPage />;
}