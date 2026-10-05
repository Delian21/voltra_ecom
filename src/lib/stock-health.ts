/** Stock health traffic light (PLAN §5): >150 Healthy · >60 Monitor · else Reorder soon. */
export type StockHealth = "healthy" | "low" | "reorder";

export function stockHealth(stock: number): StockHealth {
  if (stock > 150) return "healthy";
  if (stock > 60) return "low";
  return "reorder";
}

export const HEALTH_LABEL: Record<StockHealth, string> = {
  healthy: "Healthy",
  low: "Monitor",
  reorder: "Reorder soon",
};

/** Shopper-facing stock level, distinct from the retailer traffic light above. */
export type ShopperStockLevel = "in" | "low" | "last" | "out";

/** Shopper-facing stock label and level for catalog surfaces. */
export function shopperStock(stock: number): {
  label: string;
  level: ShopperStockLevel;
} {
  if (stock <= 0) return { label: "OUT OF STOCK", level: "out" };
  if (stock <= 15) return { label: `ONLY ${stock} LEFT`, level: "last" };
  if (stock <= 150) return { label: `LOW · ${stock}`, level: "low" };
  return { label: `IN STOCK · ${stock}`, level: "in" };
}