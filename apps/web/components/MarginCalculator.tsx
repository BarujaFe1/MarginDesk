"use client";

import type { MarginBreakdown } from "@/types";

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function MarginCalculator({
  margin,
  target,
  price,
  onPriceChange,
}: {
  margin: MarginBreakdown | null;
  target: number;
  price: number;
  onPriceChange: (value: number) => void;
}) {
  if (!margin) {
    return (
      <section className="panel">
        <h2>Calculadora de margem</h2>
        <p className="muted">Carregue a demo ou calcule uma proposta para ver o breakdown.</p>
      </section>
    );
  }

  const onTarget = margin.margin_pct >= target;

  return (
    <section className="panel">
      <h2>Calculadora de margem</h2>
      <div className="controls">
        <label style={{ flex: 1, minWidth: "200px" }}>
          Preço da proposta (R$)
          <input
            type="range"
            min={Math.max(1000, Math.floor(margin.total_cost * 0.7))}
            max={Math.ceil(margin.min_price_for_target * 1.45)}
            step={50}
            value={price}
            onChange={(e) => onPriceChange(Number(e.target.value))}
          />
          <span className="money">{brl(price)}</span>
        </label>
      </div>

      <div className="grid">
        <div className="kpi">
          <span>Margem</span>
          <strong style={{ color: onTarget ? "var(--ok)" : "var(--danger)" }}>
            {margin.margin_pct.toFixed(1)}%
          </strong>
        </div>
        <div className="kpi">
          <span>Lucro</span>
          <strong className="money">{brl(margin.profit)}</strong>
        </div>
        <div className="kpi">
          <span>Custo total</span>
          <strong className="money">{brl(margin.total_cost)}</strong>
        </div>
        <div className="kpi">
          <span>Preço mínimo ({target}%)</span>
          <strong className="money">{brl(margin.min_price_for_target)}</strong>
        </div>
      </div>

      <ul className="services" style={{ marginTop: "1rem" }}>
        <li>
          <span>Mão de obra</span>
          <span className="money">{brl(margin.labor_cost)}</span>
        </li>
        <li>
          <span>Custos diretos</span>
          <span className="money">{brl(margin.direct_costs)}</span>
        </li>
        <li>
          <span>Contingência</span>
          <span className="money">{brl(margin.contingency_cost)}</span>
        </li>
        <li>
          <span>Horas planejadas</span>
          <span>{margin.planned_hours}h</span>
        </li>
        <li>
          <span>R$/hora efetiva</span>
          <span className="money">{brl(margin.effective_hourly)}</span>
        </li>
      </ul>

      <p className="reco">{margin.recommendation}</p>
    </section>
  );
}
