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
  return (
    <section className="panel">
      <h2>
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
              type="checkbox"
              checked={f.checked}
              onChange={() => onToggle(f.flag_id)}
              aria-label={f.label}
            />
            <div>
              <div>
                <strong>{f.label}</strong>{" "}
                <span className="muted">(+{f.weight})</span>
              </div>
              {f.mitigation ? <div className="muted">{f.mitigation}</div> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
