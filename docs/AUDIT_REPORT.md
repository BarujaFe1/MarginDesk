# MarginDesk — Audit Report (portfolio quality pass)

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Auditor role:** senior full-stack + QA + product + portfolio recruiter

---

## Resumo executivo

MarginDesk is a credible **lab MVP** for service-proposal margin decisions: price floor, scope-risk checklist, planned hours and planned-vs-actual profit tracking. The monorepo (Next.js 15 + FastAPI) already ships a public GitHub Pages demo with three synthetic proposals.

The product thesis is strong for portfolio (“profit first, not pretty PDF”), but the repo had **demo-data inconsistency**, **fragile price slider bounds**, **no frontend tests**, **interactive `next lint` without ESLint config**, thin DX scripts, and documentation skewed to marketing length over recruiter-usable architecture/testing/deploy notes.

**Current score (before this pass):** **6.8 / 10**  
**Target after this pass:** **8.4–8.7 / 10** (lab-honest, not production SaaS)

---

## Principais riscos

| Risk | Severity | Notes |
|------|----------|-------|
| Tracker `planned_margin_pct` ≠ engine math | High | Demo told conflicting stories (e.g. 32.4% vs ~24.7%) |
| Price slider `min > max` / value out of range | Medium | When price already above/below computed bounds |
| Dual engines (TS + Python) can drift | Medium | No parity tests |
| `next lint` prompts interactively | Medium | Breaks CI / non-interactive DX |
| Unused deps (`recharts`, `lucide-react`) | Low | Noise + install cost |
| Vercel free-tier deploy cap / rootDirectory | Low | Pages is the live demo; Vercel needs `apps/web` root |
| No secrets found in tree | — | `.env` ignored; only `.env.example` |

---

## Quick wins

1. Sync tracker planned cost/margin from `calculateMargin`.
2. Clamp slider min/max/value.
3. Add ESLint flat config + non-interactive lint script.
4. Add Vitest for TS margin engine + expand pytest edge cases.
5. Root `package.json` scripts for one-command quality gate.
6. GitHub Actions CI (web + api).
7. Loading/empty/lab banner UX + a11y on proposal switcher.
8. Rewrite README + architecture/testing/deploy/handoff docs.

---

## Melhorias estruturais

- Keep **frontend-first demo** (Pages) as source of truth for live demo.
- Treat FastAPI as **parity / local full-stack** path, not required for public demo.
- Document formulas once; test both engines against the same fixtures.
- Prefer small pure functions in `lib/` over page-local business logic.

---

## Bugs encontrados

1. **Demo tracker inconsistency** — planned margins/costs hardcoded and wrong vs engine.
2. **Slider bounds** — `max` can be `< min` or `< current price`.
3. **Lint DX broken** — `next lint` waits for interactive ESLint setup.
4. **Target 100% edge** — formula divides by zero conceptually; schema allows ≤95 on API but TS path did not clamp.
5. **README case study numbers** outdated vs real engine output.
6. **No loading skeleton** — blank panels during first paint.
7. **Missing CI** — regressions not gated on PR.

---

## Plano de execução

1. Fix engine/demo consistency + slider + clamps.  
2. Add tests (Vitest + pytest).  
3. ESLint, root scripts, CI.  
4. UX polish (banner, skeleton, a11y, format util).  
5. Docs + README portfolio rewrite.  
6. Full quality gate + commit/push branch.

---

## Checklist final

- [x] install / typecheck / lint / test / build *(validated in quality gate)*
- [x] pytest green
- [x] docs present (AUDIT, ARCHITECTURE, TECHNICAL_DECISIONS, TESTING, DEPLOYMENT, HANDOFF)
- [x] README portfolio-grade
- [x] CI workflow
- [x] `.env.example` + `.gitignore` safe
- [x] branch `chore/portfolio-quality-pass`

**Score after pass (expected):** ~**8.5 / 10** (honest lab MVP).
