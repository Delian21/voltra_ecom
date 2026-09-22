# Backend Step 2 — Plan: localStorage → Supabase tables

Follows backend step 1 (catalog on Supabase via Drizzle, RLS-locked, deployed).
Same conventions: server-only data modules under `src/lib/data/`, Drizzle schema
in `src/lib/db/schema.ts`, mock fallback when `DATABASE_URL` is absent, and
call sites that never change (PLAN.md §4 seam).

## Current state

| Data | Today | Store |
|---|---|---|
| Catalog | ✅ on Supabase | `products` table, `lib/data/catalog.ts` |
| Cart | localStorage (`voltra-cart` v2, guest/account scopes) | Zustand + persist, client-only |
| Orders | localStorage (`voltra-orders`) + hardcoded `SAMPLE_ORDERS` | `lib/data/orders.ts` (client) |
| Retailer account | hardcoded return | `lib/data/retailer.ts` |
| Restock plans | localStorage (`voltra-restock`) | Zustand, client-only |
| Notification prefs | localStorage (`voltra-prefs`) | Zustand, client-only |
| Quotes (RFQ) | localStorage (`voltra-quotes`) | Zustand, client-only |
| Messages/threads | localStorage (`voltra-threads`, `voltra-messages`) | `lib/data/messages.ts` |

## The one structural question: cart is client-side

Cart is a Zustand client store; the DB is server-side. Two options:

- **A. Client cart stays, syncs to server.** Zustand keeps instant UI; each
  mutation also PATCHes a `carts` table keyed by a cart id (guest cookie or
  future user id). Server is source of truth on load.
  - Pro: no UI rewrite, offline-tolerant. Con: sync bugs (two writers).
- **B. Cart moves fully server-side.** Components call `data/cart.ts`
  (server actions or route handlers); Zustand becomes a cache.
  - Pro: one writer, matches how catalog already works. Con: more churn in
    `CartLines`, `useCartSummary`, `ProductActions`, `BulkCatalog`.

**Recommendation: B** — matches the existing seam (`lib/data/cart.ts` already
exists as the documented swap point), avoids dual-writer bugs, and the cart
components already treat the store as the only state, so redirecting them
through async functions is mechanical. Defer until auth exists: without a real
user identity, "account cart" has nothing durable to key on — a guest cookie
UUID works but is wiped with browser storage anyway, which defeats the point.

## Suggested table additions (schema.ts, same conventions)

- `carts` + `cart_lines` (or a single `carts` table with jsonb lines — lines
  are small; jsonb keeps the merge-on-sign-in logic simple)
- `orders` (id, buyer_ref, items jsonb, total, status, created_at) — replaces
  `SAMPLE_ORDERS` + localStorage; dashboard keeps sample rows only when the
  table is empty, same trick as today's `listRecentOrders`
- `retailer_accounts` (balance, due days, spend) — replaces the hardcoded
  `getRetailerAccount` return
- `restock_plans` (shop_name, day, skus[])
- `notification_prefs` (one row per user, defaults on first read)
- `quote_requests` (company, whatsapp, notes, lines jsonb, status, created_at)
- `threads` + `messages` — last, lowest value in prototype phase

## RLS posture (same as step 1)

Until auth exists: FORCE RLS on, no policies for anon/authenticated (tables
unreadable through anon keys), all access through the server's postgres-role
connection. When Supabase Auth lands: per-user SELECT/INSERT policies
(`auth.uid() = user_id`), and the server connection keeps owner access.

## Order of work (each step deploys green)

1. `orders` table + `lib/data/orders.ts` swap (checkout flow already calls
   `recordOrder` through the seam — smallest first slice)
2. `restock_plans` + `notification_prefs` (simple CRUD, low risk)
3. `retailer_accounts` (dashboard reads only)
4. Cart per option B, ideally after Supabase Auth so carts key on real users
5. `quote_requests`, then threads/messages if the demo inbox survives
