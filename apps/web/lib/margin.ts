import type {
  MarginBreakdown,
  ProposalInput,
  RiskLevel,
} from "@/types";
import { round2 } from "@/lib/format";

const MAX_TARGET_MARGIN_PCT = 95;

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

/**
 * Pure margin engine — mirrors `apps/api/app/services/margin_engine.py`.
 * Target margin is clamped to [0, 95] to avoid division-by-zero at 100%.
 */
export function calculateMargin(proposal: ProposalInput): MarginBreakdown {
  const laborCost = proposal.services.reduce((sum, s) => sum + s.hours * s.hourly_rate, 0);
  const serviceHours = proposal.services.reduce((sum, s) => sum + s.hours, 0);
  const avgRate = serviceHours > 0 ? laborCost / serviceHours : 0;
  const contingencyCost = proposal.contingency_hours * avgRate;
  const directCosts = proposal.costs.reduce((sum, c) => sum + c.amount, 0);
  const totalCost = laborCost + directCosts + contingencyCost;
  const price = Math.max(0, proposal.price);
  const profit = price - totalCost;
  const marginPct = price > 0 ? (profit / price) * 100 : 0;
  const target = Math.min(MAX_TARGET_MARGIN_PCT, Math.max(0, proposal.target_margin_pct));
  const minPrice =
    target >= MAX_TARGET_MARGIN_PCT
      ? totalCost / (1 - MAX_TARGET_MARGIN_PCT / 100)
      : totalCost / (1 - target / 100);
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
    planned_hours: round2(serviceHours + proposal.contingency_hours),
    // Effective rate over billable service hours (excludes contingency buffer).
    effective_hourly: round2(serviceHours > 0 ? price / serviceHours : 0),
    risk_score: Math.round(score * 10) / 10,
    risk_level: level,
    risk_flags_triggered: triggered,
    recommendation: recommendation(marginPct, target, level, priceGap),
  };
}

export function priceSliderBounds(totalCost: number, minPriceForTarget: number, price: number) {
  const min = Math.max(500, Math.floor(totalCost * 0.7));
  const max = Math.max(min + 50, Math.ceil(Math.max(minPriceForTarget, price, totalCost) * 1.45));
  const value = Math.min(max, Math.max(min, price));
  return { min, max, value };
}
