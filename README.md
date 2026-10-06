# Voltra

**Always on. Never out.**

Voltra is a storefront for direct-sourced electronics — power banks, earbuds, headsets, chargers, cables, cases — priced in ₦. One codebase serves two audiences:

- **B2C** — browse the catalog, fill a cart, check out (checkout is a stub in this phase).
- **B2B** — retailers get wholesale pricing (×10 per SKU), trade-credit dashboard, stock-health tracking, and restock plans.

Product logic and design spec: [`PLAN.md`](./PLAN.md) is the source of truth; `Voltra_Pages_Guide.pdf` is the original product guide.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui (copied into `src/components/ui`) |
| Design | **Volt Dark** — graphite surfaces, volt-lime accent `#C6FF3E`, Space Grotesk / Inter / JetBrains Mono |
| State | Zustand with `persist` (cart, auth, prefs) |
| Data | seed data + localStorage |
| Tests | Playwright (`e2e/voltra.spec.ts`) |

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing: brand, value props, audience entry points |
| `/shop`, `/shop/[slug]` | Catalog with search + category filters; product detail |
| `/cart` | Persistent cart (unit + wholesale lines; wholesale steps ×10) |
| `/checkout` (+ `/checkout/confirmation`) | Stub — address + payment method UI, "not live" |
| `/retailer` | B2B dashboard: balance, stock health, recent orders |
| `/retailer/bulk` | Wholesale catalog, add ×10 lines |
| `/retailer/quote`, `/retailer/restock` | Quote requests; set-and-forget restock plans |
| `/settings` | Notification channels, saved payment methods |
| `/messages` | Inbox / new message |

## Getting started

Requires **Node 20+**.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (same command Netlify runs)
npm run start      # serve the production build
npm run lint       # eslint
npm run e2e        # Playwright end-to-end tests
npm run e2e:headed # same, with a visible browser
```

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public site origin used as `metadataBase` for share/OG image URLs. Falls back to Netlify's build-time `URL`, then `http://localhost:3000`. Set this when you get a real domain. |

## Where things live

```
src/
  app/               # routes (App Router)
  components/        # ui/ = shadcn primitives; shell/, shop/, cart/, product/,
                     # retailer/, landing/, messages/, checkout/, settings/
  lib/
    types.ts         # Product, CartLine, Order, RetailerAccount, RestockPlan, ...
    stock-health.ts  # stock threshold helpers (150 / 60 → Healthy / Monitor / Reorder soon)
    data/            # async data modules (catalog, orders, retailer, messages)
    store/           # zustand stores (cart, auth, prefs, quotes, restock)
  hooks/
```

**Data seam:** components never touch storage directly — all data access goes through `src/lib/data/*` as async functions. The product catalog reads the bundled seed in `src/lib/data/seed.ts` (server-only, via `src/lib/data/catalog.ts`); orders, messages and the six Zustand stores are localStorage-backed prototype modules. A future backend swaps in fetch-based implementations with the same signatures, so no component rewrites.

## Deployment

The site deploys to [Netlify](https://www.netlify.com) from GitHub (`.netlify-install.log` in the repo root confirms the Netlify build runs against this checkout):

1. Push to `main` (VSCode → Source Control → Commit → Sync).
2. Netlify rebuilds automatically (`npm run build`, publish dir `.next`).
3. Share the `*.netlify.app` URL (or a password-protected deploy preview) with reviewers.

Product imagery is placeholder art for now; real photography lands later. Retailer dashboard numbers are sample data, flagged as such in the UI.
