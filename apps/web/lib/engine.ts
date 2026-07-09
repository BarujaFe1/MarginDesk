import type {
  CostItem,
  MarginBreakdown,
  ProposalInput,
  RiskLevel,
  ScopeRiskFlag,
  ServiceLine,
  TrackerProject,
} from "@/types";

function riskLevel(score: number): RiskLevel {
  if (score >= 55) return "critical";
  if (score >= 35) return "high";
  if (score >= 18) return "medium";
  return "low";
}

function recommendation(
  marginPct: number,
  target: number,
  level: RiskLevel,
  priceGap: number,
): string {
  const parts: string[] = [];
  if (marginPct < target) {
    parts.push(
      `Preço abaixo do alvo: aumente R$ ${priceGap.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ou reduza escopo/horas para atingir ${target.toFixed(0)}%.`,
    );
  } else {
    parts.push(`Margem ${marginPct.toFixed(1)}% está no alvo (${target.toFixed(0)}%).`);
  }

  if (level === "high" || level === "critical") {
    parts.push(
      "Risco de escopo elevado — feche limites de revisão, exclusões e buffer de horas antes do aceite.",
    );
  } else if (level === "medium") {
    parts.push("Risco moderado — revise flags acionados e documente mitigações no contrato.");
  } else {
    parts.push("Risco de escopo controlado.");
  }

  return parts.join(" ");
}

/** Pure margin engine — mirrors apps/api margin_engine.py for the live lab demo. */
export function calculateMargin(proposal: ProposalInput): MarginBreakdown {
  const laborCost = proposal.services.reduce((sum, s) => sum + s.hours * s.hourly_rate, 0);
  const plannedHours = proposal.services.reduce((sum, s) => sum + s.hours, 0);
  const avgRate = plannedHours > 0 ? laborCost / plannedHours : 0;
  const contingencyCost = proposal.contingency_hours * avgRate;
  const directCosts = proposal.costs.reduce((sum, c) => sum + c.amount, 0);
  const totalCost = laborCost + directCosts + contingencyCost;
  const price = proposal.price;
  const profit = price - totalCost;
  const marginPct = price > 0 ? (profit / price) * 100 : 0;
  const target = proposal.target_margin_pct;
  const minPrice = target >= 100 ? totalCost : totalCost / (1 - target / 100);
  const priceGap = Math.max(0, minPrice - price);
  const triggered = proposal.scope_flags.filter((f) => f.checked).map((f) => f.label);
  const score = proposal.scope_flags
    .filter((f) => f.checked)
    .reduce((sum, f) => sum + f.weight, 0);
  const level = riskLevel(score);

  return {
    labor_cost: round2(laborCost),
    direct_costs: round2(directCosts),
    contingency_cost: round2(contingencyCost),
    total_cost: round2(totalCost),
    price: round2(price),
    profit: round2(profit),
    margin_pct: round2(marginPct),
    min_price_for_target: round2(minPrice),
    price_gap_to_target: round2(priceGap),
    planned_hours: round2(plannedHours + proposal.contingency_hours),
    effective_hourly: round2(plannedHours > 0 ? price / plannedHours : 0),
    risk_score: Math.round(score * 10) / 10,
    risk_level: level,
    risk_flags_triggered: triggered,
    recommendation: recommendation(marginPct, target, level, priceGap),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function svc(
  id: string,
  name: string,
  hours: number,
  rate: number,
  notes: string,
): ServiceLine {
  return { service_id: id, name, hours, hourly_rate: rate, notes };
}

function cost(
  id: string,
  label: string,
  category: string,
  amount: number,
  recurring = false,
): CostItem {
  return { cost_id: id, label, category, amount, recurring };
}

function flag(
  id: string,
  label: string,
  checked: boolean,
  weight: number,
  mitigation: string,
): ScopeRiskFlag {
  return { flag_id: id, label, checked, weight, mitigation };
}

const COMMON_FLAGS = (
  overrides: Partial<Record<string, boolean>> = {},
): ScopeRiskFlag[] => [
  flag(
    "risk-open-scope",
    "Escopo aberto / 'ajustes ilimitados'",
    overrides["risk-open-scope"] ?? false,
    18,
    "Limitar a 2 rodadas de revisão por entrega",
  ),
  flag(
    "risk-no-brief",
    "Briefing incompleto",
    overrides["risk-no-brief"] ?? false,
    12,
    "Bloquear kickoff até checklist de briefing 100%",
  ),
  flag(
    "risk-third-party",
    "Dependência de terceiros sem SLA",
    overrides["risk-third-party"] ?? false,
    10,
    "Incluir buffer e cláusula de atraso externo",
  ),
  flag(
    "risk-rush",
    "Prazo agressivo (< 3 semanas)",
    overrides["risk-rush"] ?? false,
    14,
    "Adicionar taxa de urgência ou reduzir escopo",
  ),
  flag(
    "risk-unpaid-discovery",
    "Discovery não remunerado",
    overrides["risk-unpaid-discovery"] ?? false,
    8,
    "Cobrar discovery ou embutir horas no preço",
  ),
];

/** Three synthetic proposals for the lab demo. */
export const DEMO_PROPOSALS: ProposalInput[] = [
  {
    proposal_id: "prop-demo-001",
    client_name: "Studio Norte",
    project_title: "Rebrand + landing page",
    niche: "design_dev",
    currency: "BRL",
    target_margin_pct: 42,
    price: 14500,
    services: [
      svc("svc-brand", "Brand system + guidelines", 28, 120, "Logo refresh, palette, type"),
      svc("svc-site", "Landing page (Next.js)", 40, 140, "Hero, sections, responsive"),
      svc("svc-pm", "Project coordination", 8, 100, "Kickoff, reviews, handoff"),
    ],
    costs: [
      cost("cost-stock", "Stock photography pack", "assets", 180),
      cost("cost-fonts", "Premium font license", "licenses", 120),
      cost("cost-hosting", "Hosting (3 months)", "infra", 90),
    ],
    scope_flags: COMMON_FLAGS({
      "risk-open-scope": true,
      "risk-no-brief": true,
      "risk-rush": true,
    }),
    contingency_hours: 6,
    payment_terms: "40% kickoff / 40% mid / 20% delivery",
    exclusions: [
      "Copywriting longo",
      "Fotografia original",
      "Integrações de pagamento",
      "Suporte pós-entrega além de 15 dias",
    ],
  },
  {
    proposal_id: "prop-demo-002",
    client_name: "Agência Lume",
    project_title: "Social media retainer (setup)",
    niche: "social_media",
    currency: "BRL",
    target_margin_pct: 38,
    price: 6800,
    services: [
      svc("svc-strategy", "Estratégia editorial (30 dias)", 12, 110, "Pilares, calendário, tom"),
      svc("svc-design", "Templates + kit visual", 16, 100, "Carrosséis, stories, capa"),
      svc("svc-ops", "Operação inicial + handoff", 8, 90, "Processo, pasta, checklist"),
    ],
    costs: [
      cost("cost-canva", "Canva Pro (3 meses)", "tools", 120, true),
      cost("cost-stock2", "Banco de imagens", "assets", 49, true),
    ],
    scope_flags: COMMON_FLAGS({
      "risk-open-scope": true,
      "risk-unpaid-discovery": true,
      "risk-no-brief": true,
    }),
    contingency_hours: 4,
    payment_terms: "50% upfront / 50% on delivery",
    exclusions: [
      "Gestão de anúncios pagos",
      "Community management diário",
      "Produção de vídeo longa",
    ],
  },
  {
    proposal_id: "prop-demo-003",
    client_name: "Consultoria Atlas",
    project_title: "Dashboard operacional MVP",
    niche: "dev_shop",
    currency: "BRL",
    target_margin_pct: 40,
    price: 22000,
    services: [
      svc("svc-discovery", "Discovery técnico pago", 12, 150, "Métricas, fontes, wireframes"),
      svc("svc-build", "Dashboard Next.js + API", 64, 145, "KPIs, filtros, export CSV"),
      svc("svc-qa", "QA + documentação", 12, 120, "Casos de teste e handoff"),
      svc("svc-coord", "Coordenação", 8, 110, "Sprints e demos"),
    ],
    costs: [
      cost("cost-host", "Hosting + DB (3 meses)", "infra", 240),
      cost("cost-charts", "Licença charts (ano)", "licenses", 180),
      cost("cost-qa", "QA externo (1 dia)", "subcontract", 450),
    ],
    scope_flags: COMMON_FLAGS({
      "risk-third-party": true,
    }),
    contingency_hours: 8,
    payment_terms: "30% kickoff / 40% mid / 30% delivery",
    exclusions: [
      "Integração com ERP legado",
      "App mobile nativo",
      "Treinamento presencial",
      "SLA 24/7",
    ],
  },
];

export const DEMO_COST_LIBRARY: CostItem[] = [
  cost("lib-figma", "Figma Professional (mês)", "tools", 75, true),
  cost("lib-stock", "Banco de imagens", "assets", 49, true),
  cost("lib-domain", "Domínio .com.br", "infra", 40),
  cost("lib-copy", "Copywriter freela (pacote)", "subcontract", 800),
  cost("lib-qa", "QA externo (dia)", "subcontract", 450),
];

export const DEMO_TRACKER: TrackerProject[] = [
  {
    project_id: "prj-001",
    proposal_id: "prop-demo-001",
    client_name: "Studio Norte",
    project_title: "Rebrand + landing page",
    planned_hours: 82,
    actual_hours: 71.5,
    planned_cost: 9800,
    actual_cost: 9120,
    price: 14500,
    planned_margin_pct: 32.4,
    actual_margin_pct: 37.1,
    scope_change_count: 1,
    status: "in_delivery",
    alerts: [],
  },
  {
    project_id: "prj-002",
    proposal_id: "prop-demo-002",
    client_name: "Agência Lume",
    project_title: "Social media retainer (setup)",
    planned_hours: 36,
    actual_hours: 48,
    planned_cost: 4200,
    actual_cost: 5600,
    price: 6800,
    planned_margin_pct: 38.2,
    actual_margin_pct: 17.6,
    scope_change_count: 3,
    status: "in_delivery",
    alerts: [
      "Horas acima do planejado (+33%)",
      "Margem abaixo do alvo (17.6% vs 38%)",
      "3 mudanças de escopo sem aditivo",
    ],
  },
  {
    project_id: "prj-003",
    proposal_id: "prop-demo-003",
    client_name: "Consultoria Atlas",
    project_title: "Dashboard operacional MVP",
    planned_hours: 96,
    actual_hours: 102,
    planned_cost: 13200,
    actual_cost: 13840,
    price: 22000,
    planned_margin_pct: 40,
    actual_margin_pct: 37.1,
    scope_change_count: 0,
    status: "in_delivery",
    alerts: ["Pequeno estouro de horas (+6%)"],
  },
];

export function cloneProposal(proposal: ProposalInput): ProposalInput {
  return {
    ...proposal,
    services: proposal.services.map((s) => ({ ...s })),
    costs: proposal.costs.map((c) => ({ ...c })),
    scope_flags: proposal.scope_flags.map((f) => ({ ...f })),
    exclusions: [...proposal.exclusions],
  };
}

export function buildDemoBundle(activeId = "prop-demo-001") {
  const proposals = DEMO_PROPOSALS.map(cloneProposal);
  const active =
    proposals.find((p) => p.proposal_id === activeId) ?? proposals[0];
  const margin = calculateMargin(active);
  const projects = DEMO_TRACKER.map((p) => ({ ...p, alerts: [...p.alerts] }));
  const atRisk = projects.filter((p) => p.alerts.length > 0).length;
  const avgPlanned =
    projects.reduce((s, p) => s + p.planned_margin_pct, 0) / projects.length;
  const avgActual =
    projects.reduce((s, p) => s + p.actual_margin_pct, 0) / projects.length;
  const pipeline = projects.reduce((s, p) => s + p.price, 0);

  return {
    summary: {
      proposals: proposals.length,
      active_projects: projects.length,
      avg_planned_margin_pct: Math.round(avgPlanned * 10) / 10,
      avg_actual_margin_pct: Math.round(avgActual * 10) / 10,
      at_risk_projects: atRisk,
      total_pipeline_value: Math.round(pipeline * 100) / 100,
    },
    proposals,
    proposal: active,
    margin,
    cost_library: DEMO_COST_LIBRARY.map((c) => ({ ...c })),
    projects,
  };
}
