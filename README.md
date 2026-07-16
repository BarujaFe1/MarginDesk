<div align="center">
  <img src="./assets/icon.png" alt="MarginDesk Logo" width="120" height="120" />

  <h1>MarginDesk</h1>

  <p><strong>Mesa de margem para propostas de serviço — piso de preço, risco de escopo, horas e lucro do projeto.</strong></p>
  <p><strong>Service proposal margin desk — price floor, scope risk, planned hours and project profit.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> ·
    <a href="#en">English</a> ·
    <a href="#live-demo">Live Demo</a> ·
    <a href="#stack--tecnologias">Stack</a> ·
    <a href="#arquitetura--architecture">Architecture</a> ·
    <a href="#quick-start--início-rápido">Quick Start</a> ·
    <a href="#autor--author">Author</a>
  </p>

  <p>
    <a href="https://barujafe1.github.io/MarginDesk/"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Python" src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="Lab Demo" src="https://img.shields.io/badge/Status-Lab%20demo-2563EB?style=for-the-badge" />
    <img alt="MIT" src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge" />
  </p>

  <p>
    <a href="https://barujafe1.github.io/MarginDesk/"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/BarujaFe1/MarginDesk"><strong>Repositório</strong></a> ·
    <a href="https://barujafe.vercel.app/"><strong>Portfólio</strong></a> ·
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="MarginDesk overview" width="100%" />
</p>

---

<a id="pt-br"></a>

## PT-BR

## Visão geral

**MarginDesk** ajuda freelancers e pequenas agências a precificar propostas com piso de preço, risco de escopo, horas planejadas e acompanhamento de margem do projeto.

> **Aviso de lab:** demo de portfólio com dados sintéticos/amostra. Não é produto em produção com SLA, integrações reais de clientes ou garantia operacional.

---

## Problema

Propostas saem no feeling: sem piso, risco e horas, a margem some no meio do projeto.

---

## Para quem

- Freelancers e consultores
- Pequenas agências
- PMs comerciais leves

---

## Funcionalidades

- Cálculo de piso de preço
- Risco de escopo
- Horas planejadas vs impacto
- Acompanhamento de lucro/margem
- Demo estática GitHub Pages

---

## Escopo e limites

- **É:** lab de precificação/margem para serviços.
- **Não é:** ERP financeiro, folha de pagamento, CRM completo.

---

<a id="en"></a>

## English

## Overview

**MarginDesk** helps freelancers and small agencies price proposals with a price floor, scope risk, planned hours and project margin tracking.

> **Lab notice:** portfolio demo with synthetic/sample data. Not a production product with SLA, real customer integrations, or operational guarantees.

---

## Problem

Proposals leave on gut feel: without floor, risk and hours, margin disappears mid-project.

---

## Who it is for

- Freelancers and consultants
- Small agencies
- Light commercial PMs

---

## Features

- Price-floor calculation
- Scope risk
- Planned hours vs impact
- Profit/margin tracking
- Static GitHub Pages demo

---

## Scope and limits

- **Is:** service pricing/margin lab.
- **Is not:** financial ERP, payroll, full CRM.

---

<a id="live-demo"></a>

## Live Demo

**URL:** [https://barujafe1.github.io/MarginDesk/](https://barujafe1.github.io/MarginDesk/)

Demo hospedada para avaliação de portfólio / Hosted for portfolio review.

> Lab demo — synthetic / sample data unless noted. Not a production SLA product.

---

<a id="stack--tecnologias"></a>

## Stack / Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| Next.js 15 / React 19 / TypeScript | UI |
| Recharts / Lucide | Charts |
| FastAPI / Pandas / NumPy | Cálculos e API |
| Pytest / Ruff | Testes |

---

<a id="arquitetura--architecture"></a>

## Arquitetura / Architecture

Monorepo pps/api + pps/web com seeds e export estático para Pages.

`	xt
MarginDesk/
├── apps/
│   ├── api/
│   └── web/
├── assets/
├── data/seed/
├── docs/
├── scripts/
├── start.bat
└── vercel.json
`

---

<a id="quick-start--início-rápido"></a>

## Quick Start / Início rápido

### Pré-requisitos / Requirements

- Node.js 20+
- Python 3.12+
- npm

### Clonar / Clone

`ash
git clone https://github.com/BarujaFe1/MarginDesk.git
cd MarginDesk
`

### Windows (atalho)

`at
start.bat
`

Sobe API em :8000 e web em :3000.

### Manual

`ash
# API
cd apps/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
`

`ash
# Web (outro terminal)
cd apps/web
npm install
npm run dev
`

Abra http://localhost:3000

Copie .env.example se precisar de NEXT_PUBLIC_API_URL.


---

## Technical decisions / Decisões técnicas

- **Margem antes do fechamento** como UX central.
- **Pages** para demo sem backend obrigatório.
- **Seeds** para cenários de proposta reproduzíveis.

---

## Roadmap

### Implementado
- Piso, risco, horas, margem, Pages demo

### Planejado
- Templates por tipo de serviço
- Export PDF da proposta
- Histórico de projetos

---

<a id="autor--author"></a>

## Autor / Author

Developed by **Felipe Alirio Baruja**.

- **Portfolio:** [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- **GitHub:** [github.com/BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [linkedin.com/in/barujafe](https://www.linkedin.com/in/barujafe/)
- **Repository:** [github.com/BarujaFe1/MarginDesk](https://github.com/BarujaFe1/MarginDesk)

---

## License / Licença

MIT License.

See [LICENSE](./LICENSE) for details.

---

<div align="center">
  <p><strong>MarginDesk</strong></p>
  <p>Propostas com margem consciente.</p>
  <p><em>Proposals with conscious margin.</em></p>
</div>
