<div align="center">
  <img src="./assets/icon.png" alt="MarginDesk Logo" width="120" height="120" />

  <h1>MarginDesk</h1>

  <p><strong>Transforma proposta em decisão de margem — preço mínimo, risco de escopo e lucro por projeto.</strong></p>
  <p><strong>Turn service proposals into margin decisions — price floor, scope risk and project profit.</strong></p>

  <p>
    <a href="https://barujafe1.github.io/MarginDesk/"><strong>Live Demo</strong></a> •
    <a href="#1-problema--problem">Problema</a> •
    <a href="#3-arquitetura--architecture">Arquitetura</a> •
    <a href="#5-quick-start">Quick Start</a> •
    <a href="#10-o-que-este-projeto-demonstra">Portfólio</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Parity%20API-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="Vitest" src="https://img.shields.io/badge/Vitest-Engine%20Tests-729B1B?style=for-the-badge" />
    <img alt="Lab Demo" src="https://img.shields.io/badge/Status-Lab%20MVP-D4A84B?style=for-the-badge" />
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="MarginDesk product overview" width="100%" />
</p>

---

## 1. Problema / Problem

Prestadores de serviço (freelancers, agências pequenas, consultores) ainda precificam no feeling:

- subestimam horas;
- esquecem custos diretos;
- aceitam escopo aberto;
- só descobrem o prejuízo no final.

A dor é cara: margem destruída e capacidade ocupada com projeto ruim.

---

## 2. Solução / Solution

**MarginDesk** é um desk de margem para propostas de serviço. Ele calcula:

- custo de mão de obra + custos diretos + contingência;
- **preço mínimo** para a margem-alvo;
- score de **risco de escopo**;
- tracker **planejado vs realizado**.

> Posicionamento: **lucro e proteção de margem**, não estética de PDF.
>
> **Não confundir com:** [ProposalRoom](https://github.com/BarujaFe1/ProposalRoom) (sala/aceite/PDF) nem [AgendaYield](https://github.com/BarujaFe1/AgendaYield) (ocupação/no-show).

### Live Demo

https://barujafe1.github.io/MarginDesk/

Três propostas sintéticas + roteiro de demo (~4 min) na própria UI.

<p align="center">
  <img src="./assets/screenshots/01-margin-calculator.png" alt="MarginDesk lab overview" width="100%" />
</p>

---

## 3. Arquitetura / Architecture

```text
apps/web  → Next.js 15 (App Router) — lab UI + TS margin engine (public demo)
apps/api  → FastAPI + Pydantic — local parity API + pytest
docs/     → audit, architecture, testing, deployment, handoff
```

Detalhes: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)

**Fórmula (resumo):**

\[
C = \sum h_i r_i + \sum c_j + h_c \bar{r},\quad
m = (P - C)/P,\quad
P_{min} = C / (1 - t/100)
\]

Meta \(t\) limitada a 95%. Metodologia: [docs/technical_methodology.md](./docs/technical_methodology.md).

---

## 4. Stack

| Camada | Tecnologia |
|--------|------------|
| Web | Next.js 15, React 19, TypeScript |
| API | FastAPI, Pydantic v2, Uvicorn |
| Testes | Vitest (web), Pytest + Ruff (api) |
| CI | GitHub Actions |
| Demo | GitHub Pages (static export) |

---

## 5. Quick Start

### Pré-requisitos

- Node.js 20+
- Python 3.10+ (3.12 preferencial) para a API local
- Git

### Demo web (igual ao Pages)

```bash
cd apps/web
npm ci
npm run dev
```

Abra http://localhost:3000

### Full stack local (Windows)

```bash
start.bat
```

API `:8000` · Web `:3000`

### Variáveis de ambiente

Copie `.env.example` → `.env` apenas se quiser o front chamar a API:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Sem essa variável, o UI usa o motor TypeScript no browser (modo lab público).

---

## 6. Testes e qualidade

```bash
# Web
cd apps/web && npm run typecheck && npm run lint && npm run test && npm run build

# API
cd apps/api && ruff check . && pytest -q
```

Guia: [docs/TESTING.md](./docs/TESTING.md)

---

## 7. Deploy

- **Produção lab atual:** GitHub Pages — ver [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Vercel (opcional):** Root Directory = `apps/web`

---

## 8. Status atual

| Item | Status |
|------|--------|
| Lab MVP com 3 propostas | Done |
| Motor de margem testado (TS + Python) | Done |
| Demo pública | Done |
| Auth / billing / multi-tenant | Fora do escopo lab |
| PDF renderer / Toggl | Roadmap |

---

## 9. Roadmap (honesto)

1. Templates por nicho + biblioteca de escopos  
2. Alertas de estouro + integração de horas  
3. Proposta pública + aceite + cobrança inicial  
4. Benchmark de margem (ainda lab, não ERP)

---

## 10. O que este projeto demonstra

- Modelagem de regra de negócio (margem, floor, risco)
- UX de precificação com feedback imediato
- Frontend-first deploy estável para portfólio
- Paridade de domínio TS/Python com testes
- Disciplina de produto: o que **não** entra no MVP

---

## 11. Como eu apresentaria em entrevista

1. **Dor:** proposta no feeling → prejuízo.  
2. **Demo:** abrir Live Demo → trocar as 3 propostas → mover o preço → marcar risco.  
3. **Insight:** Studio Norte a R$14.5k fica **abaixo** da meta 42% — o floor aparece na hora.  
4. **Tracker:** Lume estoura horas e margem realizada cai.  
5. **Trade-off:** lab estático > SaaS incompleto fingindo produção.  
6. **Próximo passo:** aceite + cobrança sem virar ERP.

Pitch curto: [docs/portfolio_pitch.md](./docs/portfolio_pitch.md)

---

## 12. Autor

**Felipe Alirio Baruja**

- Portfolio: [barujafe.vercel.app](https://barujafe.vercel.app/)
- GitHub: [@BarujaFe1](https://github.com/BarujaFe1)
- LinkedIn: [Gustavo Felipe Alirio Baruja](https://www.linkedin.com/in/barujafe/)

## Licença

MIT © 2026 Felipe Alirio Baruja
