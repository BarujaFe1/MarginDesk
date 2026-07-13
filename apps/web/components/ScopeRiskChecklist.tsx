"use client";

import type { ScopeRiskFlag, RiskLevel } from "@/types";

export function ScopeRiskChecklist({
  flags,
  riskLevel,
  riskScore,
  onToggle,
}: {
  flags: ScopeRiskFlag[];
  riskLevel: RiskLevel | null;
  riskScore: number | null;
  onToggle: (flagId: string) => void;
}) {
  if (flags.length === 0) {
    return (
      <section className="panel" aria-busy="true">
        <h2>Scope risk checklist</h2>
        <div className="skeleton-row" />
        <div className="skeleton-row" />
        <div className="skeleton-row" />
      </section>
    );
  }

  return (
    <section className="panel" aria-labelledby="scope-risk-title">
      <h2 id="scope-risk-title">
        Scope risk checklist{" "}
        {riskLevel ? (
          <span className={`badge ${riskLevel}`}>
            {riskLevel} · {riskScore?.toFixed(0)}
          </span>
        ) : null}
      </h2>
      <ul className="risk-list">
        {flags.map((f) => (
          <li key={f.flag_id}>
            <input
              id={f.flag_id}
              type="checkbox"
              checked={f.checked}
              onChange={() => onToggle(f.flag_id)}
            />
            <div>
              <label htmlFor={f.flag_id}>
                <strong>{f.label}</strong>{" "}
                <span className="muted">(+{f.weight})</span>
              </label>
              {f.mitigation ? <div className="muted">{f.mitigation}</div> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
