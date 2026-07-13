# Technical Decisions — MarginDesk

## TD-01 — Margin-first positioning

**Decision:** Core UX is price floor, margin %, scope risk and planned vs actual — not proposal aesthetics.

**Why:** Matches the commercial thesis and differentiates from PDF generators.

## TD-02 — Frontend-first live demo

**Decision:** Ship the public demo as a static Next.js export on GitHub Pages with an in-browser margin engine.

**Why:** Reliable portfolio URL without depending on a always-on FastAPI host or Vercel free-tier quotas.

**Trade-off:** Persistence and multi-user flows are out of scope for the live demo.

## TD-03 — Pure calculation function

**Decision:** `calculateMargin` / `calculate_margin` are pure and side-effect free.

**Why:** Easy unit tests, deterministic demos, no hidden state.

## TD-04 — Target margin capped at 95%

**Decision:** Clamp target margin to ≤ 95% before computing minimum price.

**Why:** 100% margin implies division by zero / infinite price; Pydantic schema already uses `le=95`.

## TD-05 — Tracker planned values derived from engine

**Decision:** Never hardcode `planned_cost` / `planned_margin_pct` independently of the engine.

**Why:** A previous bug showed 32.4% planned vs ~24.7% live — destroys recruiter trust.

## TD-06 — Optional FastAPI backend

**Decision:** Web calls FastAPI only when `NEXT_PUBLIC_API_URL` is set; otherwise uses local TS engine.

**Why:** One codebase supports lab demo and local full-stack without forcing remote infra.

## TD-07 — No heavy chart library in MVP

**Decision:** Removed unused `recharts` / `lucide-react` until a chart surface exists.

**Why:** Smaller install, clearer dependency graph for a calculation-first lab.
