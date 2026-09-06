import { cn } from "@/lib/utils";
import { stockHealth } from "@/lib/stock-health";

const VARIANTS = {
  healthy: "bg-good-bg text-good",
  low: "bg-warn-bg text-warn",
  reorder: "bg-bad-bg text-bad",
} as const;

const LABEL = {
  healthy: "IN STOCK",
  low: "LOW",
  reorder: "REORDER SOON",
} as const;

export function StockPill({
  stock,
  className,
}: {
  stock: number;
  className?: string;
}) {
  const health = stockHealth(stock);
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold",
        VARIANTS[health],
        className,
      )}
    >
      {LABEL[health]} · {stock}
    </span>
  );
}

/**
 * Stock health bar for retailer surfaces.
 *
 * Length = how far current stock sits above the reorder line (60 units).
 * Capped at the healthy threshold (150) so the bar maxes out once a SKU is
 * comfortably stocked; it then stays full while still showing the real count.
 */
export function StockHealthBar({
  stock,
  className,
}: {
  stock: number;
  className?: string;
}) {
  const health = stockHealth(stock);
  const lowThreshold = 60;
  const highThreshold = 150;

  const raw = Math.max(0, stock - lowThreshold);
  const fraction = Math.min(1, raw / (highThreshold - lowThreshold));

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        className,
      )}
    >
      <div
        className="flex-none overflow-hidden rounded-full bg-bg2/60"
        style={{ width: "120px", height: "6px" }}
      >
        <div
          className={
            "h-full transition-[width] duration-300 ease-out " +
            (health === "healthy"
              ? "bg-good"
              : health === "low"
                ? "bg-warn"
                : "bg-bad")
          }
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
      <span className="flex-none font-mono text-[11.5px] text-ink-low tabular-nums">
        {stock} units
      </span>
    </div>
  );
}