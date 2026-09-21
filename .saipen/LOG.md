# Log

- 20.09.26 00:05 [E-001] [agent: codebuff] INIT: bootstrapped .saipen/ (STATE/BOARD/LOG); session pre-boot: README polished (uncommitted), backend plan discussed only — no builds per user
- 20.09.26 00:05 [E-002] [parent: E-001] SESSION END: user stopped for the night; stack decision pending, plan on board, zero code touched
- 20.09.26 10:00 [E-003] [parent: E-002] T-001 DONE: stack locked — Neon + Drizzle + custom OTP auth + Paystack first (user picked recommended option)
- 20.09.26 10:00 [E-004] [parent: E-003] T-002 DONE: migration plan + trust gates written to .saipen/KNOWLEDGE/backend-plan.md; T-003 confirmed done by user push (5ac006f + 549e5b3 on origin/main)
- 20.09.26 21:00 [E-005] [parent: E-004] AMEND T-001: Neon unreachable from user's region (connection timeouts, multi-browser confirmed) — stack switched to Supabase Postgres + Drizzle; Drizzle/schema/plan unchanged, driver line differs
- 20.09.26 21:15 [E-006] [parent: E-005] SMOKE TEST PASS: user's DATABASE_URL (transaction pooler :6543) reaches Supabase — PostgreSQL 17.6, from local machine; scripts/smoke-db.mjs added, pg installed
- 20.09.26 23:59 [E-007] [parent: E-006] T-004 BUILT: drizzle schema (products) + db client + seed module split (seed.ts shared, images.ts key resolver) + seed-db.mjs upsert + /api/products routes + catalog.ts DB-first with mock fallback; client-safe sync helpers split into catalog.shared.ts after pg leaked into browser bundle (caught by e2e webserver timeout, root-caused to CartSheet import chain)
- 21.09.26 00:30 [E-008] [parent: E-007] T-004 FIXED+GREEN: display_order column added after e2e caught list-order regression (DB id-order broke RFQ test contract; old array order is a UI contract) — schema pushed, reseeded, parity test extended; tsc clean, parity pass, e2e 25/25 PASS
