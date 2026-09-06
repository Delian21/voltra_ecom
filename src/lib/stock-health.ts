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