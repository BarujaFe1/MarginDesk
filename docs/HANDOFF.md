# Handoff — MarginDesk portfolio quality pass

**Branch:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Suggested commit message:** `chore: improve portfolio quality, docs, tests and stability`

---

## What was found

- Strong product thesis (margin-first SaaS lab) with working Pages demo.
- **Critical demo bug:** tracker `planned_margin_pct` / `planned_cost` hardcoded and inconsistent with the margin engine (e.g. 32.4% vs ~24.7% for Studio Norte).
- Price slider could produce invalid `min/max` ranges.
- `next lint` had no ESLint config → interactive prompt (CI-hostile).
- Unused frontend dependencies (`recharts`, `lucide-react`).
- Dual engines (TS/Python) without frontend unit tests / parity coverage.
- Docs skewed to long marketing README; missing architecture/testing/deploy/handoff set.
- No GitHub Actions CI.

## What was fixed / improved

1. Tracker planned_* now **derived from the margin engine** (TS + Python).
2. `priceSliderBounds` clamps min/max/value safely.
3. Target margin clamped to ≤95% in both engines.
4. Split domain modules: `lib/margin.ts`, `lib/demo.ts`, `lib/format.ts`.
5. Vitest suite for engine + slider + tracker consistency.
6. Expanded Pytest (tracker parity, zero price, target 95%).
7. ESLint flat config + non-interactive `eslint .`.
8. Removed unused deps; root `package.json` quality scripts.
9. UX: lab banner, skeletons, table overflow, a11y labels/tabs/focus.
10. CI workflow (web + api).
11. Docs: AUDIT, ARCHITECTURE, TECHNICAL_DECISIONS, TESTING, DEPLOYMENT, HANDOFF.
12. README rewritten as portfolio piece with live demo + interview narrative.

## Commands run

```bash
# API
cd apps/api && pytest -q && ruff check .

# Web
cd apps/web && npm ci && npm run typecheck && npm run lint && npm run test && npm run build
```

### Results (this pass)

| Check | Result |
|-------|--------|
| `tsc --noEmit` | pass |
| `eslint .` | pass |
| `vitest run` | **7 passed** |
| `next build` (static export) | pass |
| `pytest -q` | **9 passed** |
| `ruff check .` | pass |

## What still remains

- Re-publish `gh-pages` with the new UI/engine (optional follow-up).
- Fix Vercel project Root Directory = `apps/web` when quota allows.
- Visual screenshots are still generative placeholders — replace with real captures.
- No e2e browser tests (Playwright) yet.
- No persistence/auth/billing (intentional lab scope).

## Remaining risks

- TS/Python drift if only one engine is edited (mitigated by tests + docs).
- Static Pages basePath must stay `/MarginDesk` for project Pages.
- Demo actual_* alerts are narrative; planned_* are authoritative.

## Next steps

1. Merge this branch after CI green.
2. Refresh GitHub Pages artifact from `apps/web/out`.
3. Capture real screenshots for README.
4. Optionally add Playwright smoke on the static export.

## Portfolio suggestions

- Keep **Lab only** / `featured: false` until billing story exists.
- In interviews, lead with the Studio Norte under-target price moment + Lume overrun tracker.
- Link Live Demo + this README’s “Como eu apresentaria em entrevista”.

## Security

- No secrets committed; `.env` ignored; `.vercel` ignored.
- No `SECURITY_NOTES.md` incident — nothing exposed found.
