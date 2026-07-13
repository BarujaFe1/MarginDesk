"use client";

import type { MarginBreakdown } from "@/types";
import { brl, pct } from "@/lib/format";
import { priceSliderBounds } from "@/lib/margin";

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
      <section className="panel" aria-busy="true">
        <h2>Calculadora de margem</h2>
        <div className="skeleton-block" />
        <div className="skeleton-row" />
        <div className="skeleton-row" />
      </section>
    );
  }

  const onTarget = margin.margin_pct >= target;
  const bounds = priceSliderBounds(margin.total_cost, margin.min_price_for_target, price);

  return (
    <section className="panel" aria-labelledby="margin-calc-title">
      <h2 id="margin-calc-title">Calculadora de margem</h2>
      <div className="controls">
        <label style={{ flex: 1, minWidth: "200px" }} htmlFor="price-slider">
          Preço da proposta (R$)
          <input
            id="price-slider"
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={50}
            value={bounds.value}
            aria-valuemin={bounds.min}
            aria-valuemax={bounds.max}
            aria-valuenow={bounds.value}
            aria-valuetext={brl(bounds.value)}
            onChange={(e) => onPriceChange(Number(e.target.value))}
          />
          <span className="money">{brl(price)}</span>
        </label>
      </div>

      <div className="grid">
        <div className="kpi">
          <span>Margem</span>
          <strong style={{ color: onTarget ? "var(--ok)" : "var(--danger)" }}>
            {pct(margin.margin_pct)}
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
          <span>Horas planejadas (serviço + buffer)</span>
          <span>{margin.planned_hours}h</span>
        </li>
        <li>
          <span>R$/hora efetiva (só horas de serviço)</span>
          <span className="money">{brl(margin.effective_hourly)}</span>
        </li>
      </ul>

      <p className="reco" role="status">
        {margin.recommendation}
      </p>
    </section>
  );
}
