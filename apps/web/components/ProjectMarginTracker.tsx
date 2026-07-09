"use client";

import type { TrackerProject } from "@/types";

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProjectMarginTracker({ projects }: { projects: TrackerProject[] }) {
  return (
    <section className="panel">
      <h2>Project margin tracker</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Projeto</th>
            <th>Planejado</th>
            <th>Realizado</th>
            <th>Margem</th>
            <th>Alertas</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.project_id}>
              <td>
                <strong>{p.project_title}</strong>
                <div className="muted">{p.client_name}</div>
                <div className="muted">{brl(p.price)}</div>
              </td>
              <td>
                {p.planned_hours}h
                <div className="muted">{brl(p.planned_cost)}</div>
              </td>
              <td>
                {p.actual_hours}h
                <div className="muted">{brl(p.actual_cost)}</div>
              </td>
              <td>
                <div>{p.planned_margin_pct.toFixed(1)}% →</div>
                <strong
                  style={{
                    color:
                      p.actual_margin_pct >= p.planned_margin_pct - 5
                        ? "var(--ok)"
                        : "var(--danger)",
                  }}
                >
                  {p.actual_margin_pct.toFixed(1)}%
                </strong>
              </td>
              <td>
                {p.alerts.length === 0 ? (
                  <span className="muted">Sem alertas</span>
                ) : (
                  p.alerts.map((a) => (
                    <div key={a} className="alert">
                      {a}
                    </div>
                  ))
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
