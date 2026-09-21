# Voltra Backend — Locked Stack & Migration Plan

**Status:** Stack locked 20.09.26 (T-001). Plan source of truth for backend work (T-002).
**Decided:** Neon (serverless Postgres) + Drizzle ORM + custom phone/WhatsApp OTP auth + Paystack first.

## Locked stack

| Layer | Choice | Rationale |
|---|---|---|
| Database | **Neon** | Serverless Postgres, scale-to-zero, native HTTP driver built for Netlify functions (no connection timeouts), Netlify first-party integration, cheapest at low traffic, no lock-in beyond plain Postgres. |
| ORM | **Drizzle** | No engine/binaries, ~zero cold-start cost, plugs directly into Neon HTTP driver, SQL-shaped schema maps 1:1 to `src/lib/types.ts`. |
| Auth | **Custom OTP** via Termii or Twilio | Phone/WhatsApp OTP fits the Nigerian market; settings page already promises WhatsApp/SMS channels. No email-password. |
| Payments | **Paystack first**, Flutterwave later, cash-on-delivery as a flag | Paystack covers card + transfer + USSD, matching settings-page copy. Inline checkout → webhook verification server-side; never trust the client callback. |
| Validation | **zod** | `src/lib/types.ts` becomes the shared API contract; invalid input rejected at the route boundary. |

Netlify constraint: route handlers run as functions — all DB calls must use Neon's HTTP driver, never a persistent connection.

## Migration order (each step ships independently, site stays live)

1. **Catalog read swap** — seed DB with existing seed data, add `app/api/` route handlers, point `src/lib/data/catalog.ts` at fetch. Zero auth, zero risk; proves the mock-data seam before anything precious exists. Mock fallback kept.
2. **Auth + real orders** — OTP sign-in; checkout writes real orders; guest cart merges on sign-in (`voltra-cart` v2 + mock auth store rehearsed this).
3. **Paystack** — inline checkout → webhook verifies → order confirmed server-side.
4. **Retailer gate + credit** — admin approves applications; trade credit becomes a real ledger; stock health reads live inventory.
5. **Notifications** — WhatsApp/SMS via provider, honoring `NotificationPrefs`.
6. **Messages** — last, or cut entirely: the WhatsApp FAB already deep-links; a mock inbox may not justify a backend.

## Trust gates (non-negotiable, from the 20.09.26 trust discussion)

1. No real customer data until gates below pass; seed data first.
2. **Row-Level Security in Postgres itself** — e.g. user can SELECT orders only WHERE user_id = auth.uid(). DB-level defense survives buggy/hallucinated app code.
3. One narrow door: all data access through the small set of route handlers — auditable in one sitting.
4. Access-control tests as a build gate (Playwright, already in repo): "user A requests user B's order → 403" runs on every push.
5. Human review: every change ships as a Netlify deploy preview before promotion; git reverts in one command.
6. zod validation at every API boundary.
