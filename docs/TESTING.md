# Testing — MarginDesk

## Commands

### Frontend (`apps/web`)

```bash
cd apps/web
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

### Backend (`apps/api`)

```bash
cd apps/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# Unix: source .venv/bin/activate
pip install -r requirements.txt
ruff check .
pytest -q
```

### Root convenience

```bash
npm run typecheck:web
npm run lint:web
npm run test:web
npm run build:web
```

## What is covered

| Area | Where | Asserts |
|------|-------|---------|
| Margin math (Studio Norte) | Vitest + Pytest | labor, costs, contingency, % |
| Target clamp (95%) | Vitest + Pytest | min price formula |
| Zero price | Vitest + Pytest | no NaN |
| Slider bounds | Vitest | max ≥ min, value clamped |
| Tracker planned_* parity | Vitest + Pytest | equals engine output |
| HTTP smoke | Pytest | `/health`, `/api/demo`, `/api/margin/calculate`, `/api/tracker` |

## Philosophy

- Prefer **fixture-level business tests** over snapshot UI tests for this lab.
- Keep TS and Python engines aligned; if one changes, update both + tests.
