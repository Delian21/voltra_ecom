# Voltra — Step 1 Plan (review before any code)

**Status:** ✅ APPROVED · **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui · **Direction:** Volt Dark

Source of truth for product logic: `Voltra_Pages_Guide.pdf` (9 pages, two journeys). The old prototype (`Voltra_Standalone (10).html`) is the functional gist — its **behavior** carries over, its **look** does not.

---

## 1. Goals & non-goals

**Goals**
- Two clear journeys on one codebase: **B2C** (buy units at retail) and **B2B** (retailers, wholesale ×10, trade credit, stock tools).
- Real routes (URLs are shareable/bookmarkable), not one page with toggles.
- Mock-first data layer so the backend later is a swap, not a rewrite.
- A "modern techy" look: Volt Dark — graphite surfaces, one electric accent, crisp corners, display + mono type. E-commerce first, developer-cool second.
- Catalog seeded from the prototype: power banks, earbuds, headsets, chargers, cables, cases — ₦ pricing.

**Non-goals (this phase)**
- No backend, auth, or real checkout (matches guide: checkout is "the kitchen").
- No payment integration yet — but the UI must anticipate Paystack / Flutterwave / cash-on-delivery.
- No real product photography — placeholder art during dev, real imagery later.

---

## 2. Route map

Two route namespaces mirror the audience split. The guide's 9 pages map onto them directly.

| Guide page | Route | Purpose | Phase |
|---|---|---|---|
| Home | `/` | Landing: brand, value prop, audience entry (Shop / Retailers) | 1 |
| Shop | `/shop` | Catalog: search + category aisles | 1 |
| Product detail | `/shop/[slug]` | Description, specs, price modes, stock, notify-if-low | 1 |
| Cart | `/cart` | Persistent cart (units + wholesale lines), qty steppers, totals | 1 |
| Checkout | `/checkout` | Stub only: address + payment method + confirm → "not live" | 2 |
| Retailer dashboard | `/retailer` | Balance, stock health (green/amber/red), recent orders | 2 |
| Bulk order | `/retailer/bulk` | Wholesale pricing, add ×10 lines | 2 |
| Restock plan | `/retailer/restock` | Set-and-forget plans: shop, check-in day, tracked SKUs | 2 |
| Settings | `/settings` | Notification channels (WhatsApp/SMS/email), saved payment methods | 2 |
| Support | (FAB) | WhatsApp chat — floating button on every page | 1 |
| 404 / error | `not-found.tsx`, `error.tsx` | Standard Next handling | 1 |

**Audience model:** `/shop/*` = B2C, `/retailer/*` = B2B. A shared shell (header + footer + WhatsApp FAB) wraps both. The header carries the cart entry for consumers and account-ish entry for retailers. Root `/` is a neutral landing that pushes each visitor down their path — the guide's "front window" idea, done with routes instead of a toggle.

**Layouts:**
- `layout.tsx` (root): fonts, theme, shell (header/footer/FAB)
- `/shop/layout.tsx`: consumer chrome (cart badge etc.)
- `/retailer/layout.tsx`: retailer chrome (dashboard sub-nav)

---

## 3. Component inventory

**Primitives** (from shadcn/ui, restyled to Volt Dark — copied into repo, so fully ours): `Button`, `Card`, `Input`, `Badge`, `Switch`, `Sheet` (drawers), `Dialog` (product detail), `Select`, `Tabs`, `Separator`, `Skeleton`, `Sonner` (toasts), `DropdownMenu`.

**Domain components** — all to be built, grouped by ownership:

| Group | Component | Notes |
|---|---|---|
| Shell | `Header`, `Footer`, `WhatsAppFab`, `CartSheet` | header differs slightly per audience namespace |
| Landing | `Hero`, `AudienceCards`, `FeaturedProducts`, `TrustBar` | TrustBar = "direct, fair-priced, in stock" value props |
| Product | `ProductCard`, `ProductGrid`, `ProductFilters` (search + category pills), `ProductDetailDialog`, `StockPill`, `PriceTag` | dual price display (unit/wholesale) |
| Cart | `CartLine` (qty steppers, mode label), `CartSummary`, `CheckoutButton` | wholesale lines step by 10 |
| Retailer | `StatCard`, `StockHealthList` (traffic lights), `OrdersList`, `WholesaleCatalog` (add ×10), `RestockPlanForm`, `SkuChips` | from prototype, restyled |
| Settings | `NotificationPrefs`, `PaymentMethodsList`, `PrefRow` | |
| Shared | `EmptyState`, `AudienceToggle` (nav-level), `Toast` wrapper | |

**Behavior carried over from the prototype** (as user stories, not code): cart persists across reload; retail cart lines price at wholesale; stock thresholds 150 / 60 → Healthy / Monitor / Reorder soon; notify-if-low captures intent; restock plans persist; mock orders shown on dashboard with a "sample data" disclaimer.

---

## 4. Mock-data seams (backend-ready shape)

All data access goes through thin modules under `lib/data/` exposing **async functions** returning typed models. Today: localStorage-backed implementation. Backend later: same signatures, fetch-based implementation. Components never touch storage directly.

```
lib/
  types.ts          Product, Category, CartLine, Order, RetailerAccount,
                    RestockPlan, NotificationPrefs, PricingMode ('unit' | 'wholesale')
  data/
    catalog.ts      listProducts, getProduct(slug), listCategories   — seed: 8 prototype products
    cart.ts         getCart, saveCart (unit + wholesale lines)
    retailer.ts     getAccount (balance, 90-day spend), listOrders,
                    getStockHealth                        — sample data flagged as such
    plans.ts        listRestockPlans, saveRestockPlan
    prefs.ts        getNotificationPrefs, saveNotificationPrefs
    storage.ts      localStorage adapter (the only place touching it)
```

**Pricing rules (prototype parity):** every product has `price` (retail) and `wholesale`; wholesale requires min 10 units/SKU. Cart totals respect the line's mode.

**Client state:** one small store (Zustand + `persist`, backed by the storage adapter) for cart lines, audience, and prefs — mirrors the prototype's `localStorage` cart without scattering persistence. If you prefer zero extra deps, a React context with a `useLocalStorage` hook does the same job; Zustand is ~1 KB and simpler to reason about — my pick. Cart lines live in **guest/account scopes** (`voltra-cart` v2); a mock auth store (`voltra-auth`) triggers merge-on-sign-in so the account seam is exercised before the backend phase.

**Placeholder art:** a single `ProductArt` component renders deterministic gradient + product-category glyph while dev (no emojis in UI chrome; emoji only as throwaway seed glyphs until imagery exists).

---

## 5. Volt Dark design tokens

One design-token layer (CSS variables) consumed by Tailwind/shadcn. **Palette status: APPROVED** — accent = volt-lime `#C6FF3E`. Side-by-side comparison rendered in `voltra-accent-compare.html` (kept for reference).

### Color

| Token | Value | Usage |
|---|---|---|
| `--bg-0` | `#0A0C10` | page background (near-black graphite) |
| `--bg-1` | `#10131A` | cards / raised surfaces |
| `--bg-2` | `#171B24` | hover / wells / inputs |
| `--line` | `rgba(255,255,255,0.08)` | hairline borders |
| `--ink-hi` | `#F4F6FA` | primary text |
| `--ink-mid` | `#9AA3B2` | secondary text |
| `--ink-low` | `#5C6472` | tertiary / labels |
| `--accent` | `#C6FF3E` (volt-lime) | brand accent, primary CTAs, active states, logo mark |
| `--accent-ink` | `#0A0C10` (near-black on lime) | text/icon on accent fills |
| `--accent-text` | `#D8FF78` (lime lifted for dark bg) | accent used as text / eyebrows on dark surfaces |
| `--good` / bg | `#2DD4BF` teal / `rgba(45,212,191,0.12)` | Healthy, delivered, success — shifted teal so green statuses never collide with the lime accent |
| `--warn` / bg | `#F59E0B` / `rgba(245,158,11,0.12)` | Monitor |
| `--bad` / bg | `#EF4444` / `rgba(239,68,68,0.12)` | Reorder soon, error |
| `--info` / bg | electric-blue | notify / info states |

### Type

| Role | Face | Notes |
|---|---|---|
| Display | **Space Grotesk** | headings, hero, logo — techy character |
| Body | **Inter** | UI text, dense retailer tables |
| Mono | **JetBrains Mono** | prices, SKUs, order IDs, stock counts (prices in mono is a Voltra habit worth keeping) |

Scale sketch: display 30–56 px tight tracking; body 13–15 px; mono 11–13 px for data. Numeric tabular alignment in mono columns.

### Shape & texture
- Radius: 6–10 px crisp (no pill-everything). Pills only for status badges and tiny filters.
- Texture: faint grid/scanline overlay on dark hero surfaces (CSS, 3–5% opacity) — the "tech" signal.
- Elevation: borders over shadows; shadows only on drawers/modals/FAB.
- Status colors do the talking in retailer views; accent reserved for brand moments + CTAs.

### Motion
- 150–200 ms ease transitions; drawer/modal transforms; hover = bg step (`--bg-2`) + hairline brighten. No flashy animation.

---

## 6. Build order (approved)

1. **Foundation:** scaffold `create-next-app` (TS + Tailwind), wire shadcn/ui, tokens + fonts + shell (header/footer/FAB), seed catalog in `lib/data`
2. **B2C flow (phase 1):** `/` landing → `/shop` (search + filters + grid) → product detail (dialog) → `/cart` (drawer + page) with dual pricing
3. **B2B flow (phase 2):** `/retailer` dashboard → `/retailer/bulk` → `/retailer/restock` → shared `/settings`
4. **Polish:** responsive pass, empty/loading/error states, sample-data disclaimers
5. **Backend later:** swap `lib/data/*` implementations for route handlers + Prisma (not in scope now)

---

## 7. Decisions

**Resolved**
1. **Stack:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui ✓
2. **Direction:** Volt Dark ✓
3. **Accent:** volt-lime `#C6FF3E` (with `--good` shifted to teal `#2DD4BF`) ✓
4. **Logo mark:** D — "V-leg bolt" (see section 8) ✓
5. **Hero copy:** "Always on. Never out." + B2B band line (see section 8) ✓
6. **Routes:** B2C under `/shop` (product detail at `/shop/[slug]`), B2B under `/retailer`, cart `/cart`, checkout `/checkout`, settings `/settings` (see section 2) ✓

**Carry-forward (non-blocking, handled during build)**
1. **UI microcopy:** defaults locked in §8 (source of truth); adjust per screen as we build
2. **Favicon at 16 px:** mark D is a glyph mark — verify legibility at favicon size during polish; fallback is the bolt-in-square tile (mark C) for the favicon only

---

## 8. Approved identity & copy

**Locked in.** Full brand exploration lives in `voltra-brand-explore.html` (kept as reference).

### Logo mark — D · "V-leg bolt" (straight edges, two-tone)

Two strokes joined at a pointed apex:
- **Left leg — straight, ink-white** `#F4F6FA`: *the reliable line.*
- **Right leg — volt-lime** `#C6FF3E`, single sharp notch: *the current.*

SVG spec (24-unit viewBox, stroke-width 2.6, no rounding — butt caps, miter joins):
- Straight leg: `M5.2 3.6 L12 19.6`
- Live leg: `M12 19.6 L15.4 12.6 L13.9 12.6 L18.9 3.6`

Usage: wordmark glyph in header/hero and standalone on dark surfaces. Variants (all-accent, all-ink) allowed. Export as an SVG React component at build time. (Round-cap and flat-apex executions from `voltra-brand-explore.html` panel D are kept as alternates.)

### Hero copy — landing page

- **H1:** Always on. Never out.
- **Eyebrow:** Voltra · power banks · earbuds · chargers
- **Subline:** Electronics that show up when you need them — direct-sourced, fair-priced, and stocked deep enough that "out of stock" is somebody else's problem.

### B2B band copy — retailer entry

- **Line:** Stock your shop without the guesswork.
- **Subline:** Wholesale pricing from 10 units, trade credit on account, and restock plans that watch your stock so you never hear "it ran out" from a customer first.

---

## 9. Landing page spec (approved)

`app/page.tsx` = async Server Component; only client islands are `CartButton` and `WhatsAppFab`.

```
app/layout.tsx        fonts + metadata + <Shell> (Header, Footer, WhatsAppFab, <Toaster/>)
app/page.tsx          → <Hero/> <AudienceCards/> <TrustBar/> <FeaturedProducts/> <B2BBand/>
```

| Block | Content | Copy source |
|---|---|---|
| Hero | grid/scanline texture; eyebrow mono → H1 “Always on. Never out.” → subline → CTAs Shop the catalog (`/shop`) + For retailers (`/retailer`) | §8 hero |
| AudienceCards | two cards: CONSUMER “Shopping for myself” → `/shop` · RETAILER “I run a shop” → `/retailer` | guide §1 toggle intent |
| TrustBar | WHY VOLTRA strip: 3 items | §8 trust trio |
| FeaturedProducts | 4 products via `listProducts()` → shared `ProductCard` (PriceTag mono, StockPill) → “Browse the full catalog →” | §8 microcopy |
| B2BBand | accent-tinted band, left volt border; eyebrow → headline → subline → Apply for wholesale access → `/retailer` | §8 B2B band |

Build order inside milestone: `lib/types` + catalog seed → shared `ProductCard`/`PriceTag`/`StockPill` → Hero/Audience/Trust → Featured → B2B band → Shell (Header w/ LogoMark + CartButton, Footer, WhatsAppFab, Toaster).

### UI microcopy — source of truth

Folded verbatim from `voltra-brand-explore.html` §03. Prices, stock counts, and product names interpolate from the catalog at render time.

| Context | Copy | Notes |
|---|---|---|
| Trust bar (home) | “Sourced direct — no middleman markup” / “Priced fair — what it costs, plus honest margin” / “Stock you can see — live counts, honest pills” | Alt: “Direct-sourced · Fair-priced · Never out” |
| Product card · price line | `₦26,500` | Wholesale reveal: `₦22,000 from 10 units` |
| Stock pills | `IN STOCK · 220` / `LOW · 84 — next restock Tue` / `REORDER SOON · 12` | Mono, uppercase; thresholds from stock health |
| Product detail · actions | “Add to cart” · “Notify me when restocked” | Section labels: “Tech specs” · “What’s in the box” · “Stock & delivery” |
| Cart / toast | `✓ Added — ₦26,500 · Voltra 20,000mAh Power Bank` | Cart line mode label: “wholesale · steps of 10” |
| Empty states | “No matches for “xyz”. Try another search — or browse the aisles.” | Cart: “Your cart is empty. Power up from the shop.” |
| Retailer chrome | “Outstanding balance · due in 6 days” · “Check-in day” · “Products to track” | Sample-data disclaimer: “Sample data for prototype” |
