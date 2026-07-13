"use client";

import type { ProposalInput, MarginBreakdown } from "@/types";
import { brl, pct } from "@/lib/format";

export function ProposalPreview({
  proposal,
  margin,
}: {
  proposal: ProposalInput | null;
  margin: MarginBreakdown | null;
}) {
  if (!proposal || !margin) {
    return (
      <section className="panel" aria-busy="true">
        <h2>Proposal preview</h2>
        <div className="skeleton-block" />
      </section>
    );
  }

  return (
    <section className="panel" aria-labelledby="proposal-preview-title">
      <h2 id="proposal-preview-title">Proposal preview</h2>
      <p className="muted">
        {proposal.client_name} · {proposal.niche}
      </p>
      <h3 style={{ margin: "0.35rem 0 0.75rem", fontFamily: "var(--font-display)" }}>
        {proposal.project_title}
      </h3>
      <ul className="services">
        {proposal.services.map((s) => (
          <li key={s.service_id}>
            <span>
              {s.name}
              <div className="muted">
                {s.hours}h × {brl(s.hourly_rate)}
              </div>
            </span>
            <span className="money">{brl(s.hours * s.hourly_rate)}</span>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "0.9rem" }} className="grid">
        <div className="kpi">
          <span>Investimento</span>
          <strong className="money">{brl(proposal.price)}</strong>
        </div>
        <div className="kpi">
          <span>Margem interna</span>
          <strong>{pct(margin.margin_pct)}</strong>
        </div>
        <div className="kpi">
          <span>Risco de escopo</span>
          <strong className={`badge ${margin.risk_level}`}>{margin.risk_level}</strong>
        </div>
        <div className="kpi">
          <span>Pagamento</span>
          <strong style={{ fontSize: "0.85rem" }}>{proposal.payment_terms}</strong>
        </div>
      </div>
      {proposal.exclusions.length > 0 ? (
        <div style={{ marginTop: "0.85rem" }}>
          <div className="muted">Exclusões / limites</div>
          <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.1rem", color: "#d8cfc0" }}>
            {proposal.exclusions.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
