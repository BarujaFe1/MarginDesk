# Deployment — MarginDesk

## Live demo (current)

**URL:** https://barujafe1.github.io/MarginDesk/

| Item | Value |
|------|-------|
| Host | GitHub Pages |
| Branch | `gh-pages` |
| Build | `apps/web` static export (`output: "export"`) |
| Base path | `/MarginDesk` via `NEXT_PUBLIC_BASE_PATH` |

### Rebuild Pages locally

```bash
cd apps/web
set NEXT_PUBLIC_BASE_PATH=/MarginDesk   # PowerShell: $env:NEXT_PUBLIC_BASE_PATH="/MarginDesk"
npm run build
# publish apps/web/out to gh-pages (see prior release script / CI future)
```

Repo homepage metadata points to the Pages URL.

## Vercel (optional)

Project `margindesk` exists. For a green deploy:

1. Set **Root Directory** to `apps/web`.
2. Framework: Next.js (auto build/install).
3. Leave `NEXT_PUBLIC_BASE_PATH` empty for `*.vercel.app`.
4. Do **not** require FastAPI for the lab demo.

Note: Free-tier daily deployment caps can block CLI deploys; Pages remains the stable public demo.

## Local full stack

```bash
# from repo root
start.bat
# or manually:
# API :8000 — apps/api uvicorn
# Web :3000 — apps/web next dev
```

Copy `.env.example` → `.env` if you want the web app to call the API:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Without that variable, the UI uses the in-browser engine (same as Pages).
