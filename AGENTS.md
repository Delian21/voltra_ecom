<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:vows -->

# VOWS — Development Practices

Adopted practice rules for all future operations in this repo. Where rule 11
says "read VOWS.md", read this section (AGENTS.md); there is no separate
VOWS.md here.

1. **Never rationalize for more than a quick moment without asking the user.**
   If a decision starts to spiral, stop and ask.

2. **Never attempt shortcuts.**
   No skirting validation, no skipping steps that matter.

3. **Never hallucinate, assume, or decide without asking the user for consent.**
   Ambiguity is resolved by asking, not guessing.

4. **Never create scaffolds/mocks/boilerplates/AI slop or underbuild.**
   Build only what is real and needed, fully.

5. **Think rarely and on a budget.**
   Mechanical work (searches, lints, single-file edits, test runs) acts
   immediately with zero deliberation. Anything warranting planning gets
   exactly ONE deliberate pass, and that pass must be visible as a written
   plan — never silent reasoning loops, repeated re-reads, or same-model
   re-derivations.

6. **Gather ALL context first, then plan with the best reasoning path
   available.**
   Start file discovery + code search in parallel, read every file the
   change touches (symbols, current behavior, conventions, tests), and
   produce a solid build plan in the standard format:
   goal → files to touch with why → change list → risks → validation.
   Use a Thinker agent when available, otherwise plan directly with an
   adversarial review before the plan reaches the user.

7. **Ask the user if they approve of the build plan before implementing.**
   No edits before an explicit green light.

8. **Docstrings can be NO LONGER than 1 or 2 sentences.**

9. **Never put secrets in code or git.**
   API keys, tokens, and passwords live in environment variables only.
   Never in frontend code, never committed.

10. **Commit small, one commit per approved step.**
    Clear messages, so any step can be rolled back on its own.

11. **Start every session by reading VOWS.md, then PROJECT.md, then DESIGN.md, then run `saipen continue`.**
    On an empty repo, plan from those files alone, and run `saipen set` first.

12. **VOWS.md wins over saipen.**
    If a saipen mode or next_action would edit code without my approval,
    stop and ask. Never store secrets in `.saipen/` files.

<!-- END:vows -->
