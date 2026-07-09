from __future__ import annotations

from typing import Any


def _services() -> list[dict[str, Any]]:
    return [
        {
            "service_id": "svc-brand",
            "name": "Brand system + guidelines",
            "hours": 28.0,
            "hourly_rate": 120.0,
            "notes": "Logo refresh, palette, type, usage rules",
        },
        {
            "service_id": "svc-site",
            "name": "Landing page (Next.js)",
            "hours": 40.0,
            "hourly_rate": 140.0,
            "notes": "Hero, sections, responsive, basic CMS hooks",
        },
        {
            "service_id": "svc-pm",
            "name": "Project coordination",
            "hours": 8.0,
            "hourly_rate": 100.0,
            "notes": "Kickoff, reviews, handoff",
        },
    ]


def _costs() -> list[dict[str, Any]]:
    return [
        {
            "cost_id": "cost-stock",
            "label": "Stock photography pack",
            "category": "assets",
            "amount": 180.0,
            "recurring": False,
        },
        {
            "cost_id": "cost-fonts",
            "label": "Premium font license",
            "category": "licenses",
            "amount": 120.0,
            "recurring": False,
        },
        {
            "cost_id": "cost-hosting",
            "label": "Hosting (3 months)",
            "category": "infra",
            "amount": 90.0,
            "recurring": False,
        },
    ]


def _scope_flags() -> list[dict[str, Any]]:
    return [
        {
            "flag_id": "risk-open-scope",
            "label": "Escopo aberto / 'ajustes ilimitados'",
            "checked": True,
            "weight": 18.0,
            "mitigation": "Limitar a 2 rodadas de revisão por entrega",
        },
        {
            "flag_id": "risk-no-brief",
            "label": "Briefing incompleto",
            "checked": True,
            "weight": 12.0,
            "mitigation": "Bloquear kickoff até checklist de briefing 100%",
        },
        {
            "flag_id": "risk-third-party",
            "label": "Dependência de terceiros sem SLA",
            "checked": False,
            "weight": 10.0,
            "mitigation": "Incluir buffer e cláusula de atraso externo",
        },
        {
            "flag_id": "risk-rush",
            "label": "Prazo agressivo (< 3 semanas)",
            "checked": True,
            "weight": 14.0,
            "mitigation": "Adicionar taxa de urgência ou reduzir escopo",
        },
        {
            "flag_id": "risk-unpaid-discovery",
            "label": "Discovery não remunerado",
            "checked": False,
            "weight": 8.0,
            "mitigation": "Cobrar discovery ou embutir horas no preço",
        },
    ]


def _flags(**checked: bool) -> list[dict[str, Any]]:
    items = [dict(f) for f in _scope_flags()]
    for item in items:
        item["checked"] = bool(checked.get(item["flag_id"], False))
    return items


def demo_proposals() -> list[dict[str, Any]]:
    return [
        {
            "proposal_id": "prop-demo-001",
            "client_name": "Studio Norte",
            "project_title": "Rebrand + landing page",
            "niche": "design_dev",
            "currency": "BRL",
            "target_margin_pct": 42.0,
            "price": 14500.0,
            "services": _services(),
            "costs": _costs(),
            "scope_flags": _flags(
                **{
                    "risk-open-scope": True,
                    "risk-no-brief": True,
                    "risk-rush": True,
                }
            ),
            "contingency_hours": 6.0,
            "payment_terms": "40% kickoff / 40% mid / 20% delivery",
            "exclusions": [
                "Copywriting longo",
                "Fotografia original",
                "Integrações de pagamento",
                "Suporte pós-entrega além de 15 dias",
            ],
        },
        {
            "proposal_id": "prop-demo-002",
            "client_name": "Agência Lume",
            "project_title": "Social media retainer (setup)",
            "niche": "social_media",
            "currency": "BRL",
            "target_margin_pct": 38.0,
            "price": 6800.0,
            "services": [
                {
                    "service_id": "svc-strategy",
                    "name": "Estratégia editorial (30 dias)",
                    "hours": 12.0,
                    "hourly_rate": 110.0,
                    "notes": "Pilares, calendário, tom",
                },
                {
                    "service_id": "svc-design",
                    "name": "Templates + kit visual",
                    "hours": 16.0,
                    "hourly_rate": 100.0,
                    "notes": "Carrosséis, stories, capa",
                },
                {
                    "service_id": "svc-ops",
                    "name": "Operação inicial + handoff",
                    "hours": 8.0,
                    "hourly_rate": 90.0,
                    "notes": "Processo, pasta, checklist",
                },
            ],
            "costs": [
                {
                    "cost_id": "cost-canva",
                    "label": "Canva Pro (3 meses)",
                    "category": "tools",
                    "amount": 120.0,
                    "recurring": True,
                },
                {
                    "cost_id": "cost-stock2",
                    "label": "Banco de imagens",
                    "category": "assets",
                    "amount": 49.0,
                    "recurring": True,
                },
            ],
            "scope_flags": _flags(
                **{
                    "risk-open-scope": True,
                    "risk-unpaid-discovery": True,
                    "risk-no-brief": True,
                }
            ),
            "contingency_hours": 4.0,
            "payment_terms": "50% upfront / 50% on delivery",
            "exclusions": [
                "Gestão de anúncios pagos",
                "Community management diário",
                "Produção de vídeo longa",
            ],
        },
        {
            "proposal_id": "prop-demo-003",
            "client_name": "Consultoria Atlas",
            "project_title": "Dashboard operacional MVP",
            "niche": "dev_shop",
            "currency": "BRL",
            "target_margin_pct": 40.0,
            "price": 22000.0,
            "services": [
                {
                    "service_id": "svc-discovery",
                    "name": "Discovery técnico pago",
                    "hours": 12.0,
                    "hourly_rate": 150.0,
                    "notes": "Métricas, fontes, wireframes",
                },
                {
                    "service_id": "svc-build",
                    "name": "Dashboard Next.js + API",
                    "hours": 64.0,
                    "hourly_rate": 145.0,
                    "notes": "KPIs, filtros, export CSV",
                },
                {
                    "service_id": "svc-qa",
                    "name": "QA + documentação",
                    "hours": 12.0,
                    "hourly_rate": 120.0,
                    "notes": "Casos de teste e handoff",
                },
                {
                    "service_id": "svc-coord",
                    "name": "Coordenação",
                    "hours": 8.0,
                    "hourly_rate": 110.0,
                    "notes": "Sprints e demos",
                },
            ],
            "costs": [
                {
                    "cost_id": "cost-host",
                    "label": "Hosting + DB (3 meses)",
                    "category": "infra",
                    "amount": 240.0,
                    "recurring": False,
                },
                {
                    "cost_id": "cost-charts",
                    "label": "Licença charts (ano)",
                    "category": "licenses",
                    "amount": 180.0,
                    "recurring": False,
                },
                {
                    "cost_id": "cost-qa",
                    "label": "QA externo (1 dia)",
                    "category": "subcontract",
                    "amount": 450.0,
                    "recurring": False,
                },
            ],
            "scope_flags": _flags(**{"risk-third-party": True}),
            "contingency_hours": 8.0,
            "payment_terms": "30% kickoff / 40% mid / 30% delivery",
            "exclusions": [
                "Integração com ERP legado",
                "App mobile nativo",
                "Treinamento presencial",
                "SLA 24/7",
            ],
        },
    ]


def demo_proposal() -> dict[str, Any]:
    return demo_proposals()[0]


def demo_tracker_projects() -> list[dict[str, Any]]:
    return [
        {
            "project_id": "prj-001",
            "proposal_id": "prop-demo-001",
            "client_name": "Studio Norte",
            "project_title": "Rebrand + landing page",
            "planned_hours": 82.0,
            "actual_hours": 71.5,
            "planned_cost": 9800.0,
            "actual_cost": 9120.0,
            "price": 14500.0,
            "planned_margin_pct": 32.4,
            "actual_margin_pct": 37.1,
            "scope_change_count": 1,
            "status": "in_delivery",
            "alerts": [],
        },
        {
            "project_id": "prj-002",
            "proposal_id": "prop-demo-002",
            "client_name": "Agência Lume",
            "project_title": "Social media retainer (setup)",
            "planned_hours": 36.0,
            "actual_hours": 48.0,
            "planned_cost": 4200.0,
            "actual_cost": 5600.0,
            "price": 6800.0,
            "planned_margin_pct": 38.2,
            "actual_margin_pct": 17.6,
            "scope_change_count": 3,
            "status": "in_delivery",
            "alerts": [
                "Horas acima do planejado (+33%)",
                "Margem abaixo do alvo (17.6% vs 38%)",
                "3 mudanças de escopo sem aditivo",
            ],
        },
        {
            "project_id": "prj-003",
            "proposal_id": "prop-demo-003",
            "client_name": "Consultoria Atlas",
            "project_title": "Dashboard operacional MVP",
            "planned_hours": 96.0,
            "actual_hours": 102.0,
            "planned_cost": 13200.0,
            "actual_cost": 13840.0,
            "price": 22000.0,
            "planned_margin_pct": 40.0,
            "actual_margin_pct": 37.1,
            "scope_change_count": 0,
            "status": "in_delivery",
            "alerts": ["Pequeno estouro de horas (+6%)"],
        },
    ]


def demo_cost_library() -> list[dict[str, Any]]:
    return [
        {"cost_id": "lib-figma", "label": "Figma Professional (mês)", "category": "tools", "amount": 75.0, "recurring": True},
        {"cost_id": "lib-stock", "label": "Banco de imagens", "category": "assets", "amount": 49.0, "recurring": True},
        {"cost_id": "lib-domain", "label": "Domínio .com.br", "category": "infra", "amount": 40.0, "recurring": False},
        {"cost_id": "lib-copy", "label": "Copywriter freela (pacote)", "category": "subcontract", "amount": 800.0, "recurring": False},
        {"cost_id": "lib-qa", "label": "QA externo (dia)", "category": "subcontract", "amount": 450.0, "recurring": False},
    ]
