# Demo Capture Guide — MarginDesk

## Objetivo

Gerar screenshots **reais** (sem PII) a partir do lab estático exportado.

## Comando automatizado

Na raiz do repo:

```bash
cd apps/web
$env:NEXT_PUBLIC_BASE_PATH="/MarginDesk"
npm run build

cd ../..
npx --yes playwright install chromium
node scripts/capture_screenshots.mjs
```

Saída:

- `assets/screenshots/01-…08-….png`
- `assets/hero-cover.png`
- `assets/social-preview.png` (cópia do hero)

## Roteiro manual (fallback)

1. Abrir https://barujafe1.github.io/MarginDesk/
2. Confirmar banner **Lab demo** e roteiro de 5 passos.
3. Capturar viewport 1440×900:
   - hero + switcher
   - calculadora
   - scope risk
   - cost library
   - tracker (com Agência Lume selecionada)
4. Não incluir dados pessoais reais — só fixtures sintéticas.

## Verificação anti-stale

A página pública **deve** conter as strings:

- `Lab demo`
- `Roteiro de demo`
- `Studio Norte`
- `Agência Lume`
