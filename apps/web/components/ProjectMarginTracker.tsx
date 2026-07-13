"use client";

import type { TrackerProject } from "@/types";
import { brl, pct } from "@/lib/format";

export function ProjectMarginTracker({ projects }: { projects: TrackerProject[] }) {
  if (projects.length === 0) {
    return (
      <section className="panel" aria-busy="true">
        <h2>Project margin tracker</h2>
        <div className="skeleton-block" />
      </section>
    );
  }

  return (
    <section className="panel" aria-labelledby="tracker-title">
      <h2 id="tracker-title">Project margin tracker</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Projeto</th>
              <th scope="col">Planejado</th>
              <th scope="col">Realizado</th>
              <th scope="col">Margem</th>
              <th scope="col">Alertas</th>
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
                  <div>{pct(p.planned_margin_pct)} →</div>
                  <strong
                    style={{
                      color:
                        p.actual_margin_pct >= p.planned_margin_pct - 5
                          ? "var(--ok)"
                          : "var(--danger)",
                    }}
                  >
                    {pct(p.actual_margin_pct)}
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
      </div>
    </section>
  );
}
