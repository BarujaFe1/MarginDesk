# Architecture — MarginDesk

## Purpose

MarginDesk turns a service proposal into a **margin decision**: total cost basis, minimum price for a target margin, scope-risk score, and planned-vs-actual profitability tracking.

This repository is a **lab MVP / portfolio product**, not a multi-tenant production SaaS.

## High-level shape

```text
MarginDesk/
├── apps/web/     # Next.js 15 App Router — live demo (frontend-first)
├── apps/api/     # FastAPI — local parity API + pytest
├── data/seed/    # CSV fixtures for documentation / future import
├── assets/       # README visuals
├── docs/         # Audit, architecture, testing, deploy, handoff
└── scripts/      # Asset/seed generators
```

## Runtime modes

| Mode | How | Engine |
|------|-----|--------|
| **Public lab demo** | GitHub Pages static export | TypeScript `lib/margin.ts` in the browser |
| **Local full stack** | `start.bat` / uvicorn + `next dev` | FastAPI if `NEXT_PUBLIC_API_URL` set; else TS engine |
| **CI** | GitHub Actions | Vitest (TS) + Pytest (Python) |

## Domain modules

- **Margin engine** — pure function: services, costs, contingency → breakdown + min price + risk.
- **Scope risk** — weighted checklist → score → low/medium/high/critical.
- **Demo catalog** — three synthetic proposals (design, social, dashboard MVP).
- **Tracker** — planned_* derived from engine; actual_* are delivery narrative.

## Why dual engines (TS + Python)?

- Public demo must work **without a Python host** (Pages / static export).
- Python API keeps a testable server path and mirrors domain rules for interview demos.
- Parity is enforced by fixture tests on both sides.

## Non-goals (MVP)

- Persistence / auth / multi-tenant billing
- ERP, full CRM, project management, fiscal accounting
- Pretty PDF as the core product
