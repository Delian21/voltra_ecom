import type { Metadata } from "next";
import { getRetailerAccount, listRecentOrders } from "@/lib/data/retailer";
import { listProducts } from "@/lib/data/catalog";
import { stockHealth, HEALTH_LABEL } from "@/lib/stock-health";
import { formatNaira } from "@/components/product/PriceTag";
import { StockHealthBar } from "@/components/product/StockPill";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Outstanding balance, stock health, and recent orders.",
};

const DOT: Record<ReturnType<typeof stockHealth>, string> = {
  healthy: "bg-good",
  low: "bg-warn",
  reorder: "bg-bad",
};

const PILL: Record<ReturnType<typeof stockHealth>, string> = {
  healthy: "bg-good-bg text-good",
  low: "bg-warn-bg text-warn",
  reorder: "bg-bad-bg text-bad",
};

export default async function RetailerDashboard() {
  const [account, orders, products] = await Promise.all([
    getRetailerAccount(),
    listRecentOrders(),
    listProducts(),
  ]);

  const recentOrders = orders.map((o) => ({ ...o, buyer: o.buyer ?? null }));

  const stock = products.map((p) => ({
    name: p.name,
    stock: p.stock,
    health: stockHealth(p.stock),
  }));

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-line border-l-[3px] border-l-volt bg-bg0 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low">
            Outstanding balance
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold text-ink-hi">
            {formatNaira(account.balance)}
          </p>
          <p className="mt-1.5 font-mono text-[10.5px] text-volt-text">
            Due in {account.balanceDueDays} days
          </p>
        </div>
        <div className="rounded-xl border border-line bg-bg1 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low">
            Orders this month
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold text-ink-hi">
            {account.ordersThisMonth}
          </p>
          <p className="mt-1.5 font-mono text-[10.5px] text-ink-low">
            Trade credit account
          </p>
        </div>
        <div className="rounded-xl border border-line bg-bg1 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-low">
            Total spent (90 days)
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold text-ink-hi">
            {formatNaira(account.totalSpent90)}
          </p>
          <p className="mt-1.5 font-mono text-[10.5px] text-ink-low">
            Across {recentOrders.length} orders
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-[15px] font-semibold text-ink-hi">
          Stock health — your tracked products
        </h2>
        <p className="mt-2 text-xs text-ink-mid">
          Bars show how far each SKU sits above the reorder line. Healthy is above 150 units, monitor is 61–150, and reorder soon is 60 or fewer.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-bg1">
          {stock.map((s, i) => (
            <div
              key={s.name}
              className={`flex items-center gap-5 px-5 py-3.5 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`size-2 flex-none rounded-full ${DOT[s.health]}`}
                  />
                  <span className="truncate text-[13.5px] text-ink-hi">
                    {s.name}
                  </span>
                </div>
                <StockHealthBar stock={s.stock} className="mt-2" />
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${PILL[s.health]}`}
                >
                  {HEALTH_LABEL[s.health]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[15px] font-semibold text-ink-hi">
          Recent orders
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-bg1">
          {recentOrders.slice(0, 8).map((o, i) => (
            <div
              key={o.id}
              className={`flex items-center justify-between gap-3 px-5 py-3.5 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="font-mono text-[12.5px] font-semibold text-ink-hi">
                  {o.id}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-mid">
                  {o.items}
                </p>
                {o.buyer ? (
                  <p className="mt-0.5 truncate text-[10.5px] text-ink-low">
                    Buyer: {o.buyer}
                  </p>
                ) : null}
              </div>
              <div className="flex-none text-right">
                <p className="font-mono text-[12.5px] font-semibold text-ink-hi">
                  {formatNaira(o.total)}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-good">
                  {o.status} · {o.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 font-mono text-[10.5px] text-ink-low">
        Dashboard figures are illustrative sample data for this prototype.
      </p>
    </>
  );
}