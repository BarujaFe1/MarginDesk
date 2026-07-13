# PORTFOLIO_HANDOFF — MarginDesk

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Role recommendation:** **Laboratório** (lab only — not home featured)

---

## Summary

MarginDesk is a **service proposal margin desk**: price floor, scope-risk checklist, planned hours and planned-vs-actual profit. It is a frontend-first lab MVP with a FastAPI parity API. Public demo runs on GitHub Pages.

## Before → After (this session)

| Item | Before | After |
|------|--------|-------|
| Public Pages build | Stale (pre lab-banner / guide) | Rebuilt & force-pushed `gh-pages` |
| Screenshots | Generative placeholders | Real Playwright captures (synthetic UI) |
| Demo journey | Implicit | In-UI 5-step interview guide |
| Differentiation | Weak vs ProposalRoom | Explicit: margin ≠ PDF/aceite ≠ agenda yield |
| Gates | Already green on branch | Re-validated after UI change |

## Canonical links

- Repo: https://github.com/BarujaFe1/MarginDesk
- Live demo: https://barujafe1.github.io/MarginDesk/
- Branch: https://github.com/BarujaFe1/MarginDesk/tree/chore/portfolio-quality-pass

## Commands

```bash
cd apps/web && npm ci && npm run typecheck && npm run lint && npm run test && npm run build
cd ../api && pytest -q && ruff check .
# Screenshots + Pages refresh
cd apps/web && set NEXT_PUBLIC_BASE_PATH=/MarginDesk && npm run build
node scripts/capture_screenshots.mjs
# then publish apps/web/out → gh-pages
```

## Limitations (honest)

- Lab / MVP — no auth, billing, multi-tenant persistence.
- Actual_* tracker alerts are narrative; planned_* come from the engine.
- FastAPI is optional for the public demo.
- Not a proposal PDF product (see ProposalRoom) and not agenda ops (see AgendaYield).

## Portfolio placement

- `featured: false`, `lab: true`
- Card emphasis: **margem / floor / risco / planned vs actual**
- Do **not** feature alongside ProposalRoom as “proposal SaaS twins” on the home strip.

## Next steps

1. Merge `chore/portfolio-quality-pass` → `main` when ready.
2. Optional: Vercel with Root Directory `apps/web`.
3. Optional: Playwright CI smoke against static export.
