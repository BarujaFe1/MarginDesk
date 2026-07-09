from __future__ import annotations

from typing import Any

from app.models.schemas import ProposalInput


def _risk_level(score: float) -> str:
    if score >= 55:
        return "critical"
    if score >= 35:
        return "high"
    if score >= 18:
        return "medium"
    return "low"


def _recommendation(
    margin_pct: float,
    target: float,
    risk_level: str,
    price_gap: float,
) -> str:
    parts: list[str] = []
    if margin_pct < target:
        parts.append(
            f"Preço abaixo do alvo: aumente R$ {price_gap:,.2f} "
            f"ou reduza escopo/horas para atingir {target:.0f}%."
        )
    else:
        parts.append(f"Margem {margin_pct:.1f}% está no alvo ({target:.0f}%).")

    if risk_level in {"high", "critical"}:
        parts.append(
            "Risco de escopo elevado — feche limites de revisão, exclusões e buffer de horas antes do aceite."
        )
    elif risk_level == "medium":
        parts.append("Risco moderado — revise flags acionados e documente mitigações no contrato.")
    else:
        parts.append("Risco de escopo controlado.")

    return " ".join(parts)


def calculate_margin(proposal: ProposalInput) -> dict[str, Any]:
    labor_cost = sum(s.hours * s.hourly_rate for s in proposal.services)
    planned_hours = sum(s.hours for s in proposal.services)
    avg_rate = (labor_cost / planned_hours) if planned_hours > 0 else 0.0
    contingency_cost = proposal.contingency_hours * avg_rate
    direct_costs = sum(c.amount for c in proposal.costs)
    total_cost = labor_cost + direct_costs + contingency_cost
    price = proposal.price
    profit = price - total_cost
    margin_pct = (profit / price * 100.0) if price > 0 else 0.0

    target = proposal.target_margin_pct
    # price = total_cost / (1 - target/100)
    if target >= 100:
        min_price = total_cost
    else:
        min_price = total_cost / (1.0 - target / 100.0)
    price_gap = max(0.0, min_price - price)

    triggered = [f.label for f in proposal.scope_flags if f.checked]
    risk_score = float(sum(f.weight for f in proposal.scope_flags if f.checked))
    risk_level = _risk_level(risk_score)

    effective_hourly = (price / planned_hours) if planned_hours > 0 else 0.0

    return {
        "labor_cost": round(labor_cost, 2),
        "direct_costs": round(direct_costs, 2),
        "contingency_cost": round(contingency_cost, 2),
        "total_cost": round(total_cost, 2),
        "price": round(price, 2),
        "profit": round(profit, 2),
        "margin_pct": round(margin_pct, 2),
        "min_price_for_target": round(min_price, 2),
        "price_gap_to_target": round(price_gap, 2),
        "planned_hours": round(planned_hours + proposal.contingency_hours, 2),
        "effective_hourly": round(effective_hourly, 2),
        "risk_score": round(risk_score, 1),
        "risk_level": risk_level,
        "risk_flags_triggered": triggered,
        "recommendation": _recommendation(margin_pct, target, risk_level, price_gap),
    }


def build_proposal_result(proposal: ProposalInput, status: str = "draft") -> dict[str, Any]:
    margin = calculate_margin(proposal)
    slug = None
    if proposal.proposal_id:
        slug = proposal.proposal_id.replace("prop-", "p/")
    return {
        "proposal": proposal.model_dump(),
        "margin": margin,
        "status": status,
        "public_slug": slug,
    }
