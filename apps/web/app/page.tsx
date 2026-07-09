"use client";

import { useEffect, useState, useTransition } from "react";
import { MarginCalculator } from "@/components/MarginCalculator";
import { ProjectMarginTracker } from "@/components/ProjectMarginTracker";
import { ProposalPreview } from "@/components/ProposalPreview";
import { ScopeRiskChecklist } from "@/components/ScopeRiskChecklist";
import { calculateMargin, fetchDemo } from "@/lib/api";
import type {
  CostItem,
  DemoSummary,
  MarginBreakdown,
  ProposalInput,
  TrackerProject,
} from "@/types";

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function HomePage() {
  const [summary, setSummary] = useState<DemoSummary | null>(null);
  const [proposal, setProposal] = useState<ProposalInput | null>(null);
  const [margin, setMargin] = useState<MarginBreakdown | null>(null);
  const [projects, setProjects] = useState<TrackerProject[]>([]);
  const [costLibrary, setCostLibrary] = useState<CostItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function loadDemo() {
    startTransition(async () => {
      try {
        setError(null);
        const data = await fetchDemo();
        setSummary(data.summary);
        setProposal(data.proposal);
        setMargin(data.margin);
        setProjects(data.projects);
        setCostLibrary(data.cost_library);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load MarginDesk API");
      }
    });
  }

  useEffect(() => {
    loadDemo();
  }, []);

  function recalc(next: ProposalInput) {
    startTransition(async () => {
      try {
        setError(null);
        setProposal(next);
        const res = await calculateMargin(next);
        setMargin(res.margin);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Calculate failed");
      }
    });
  }

  function onPriceChange(value: number) {
    if (!proposal) return;
    recalc({ ...proposal, price: value });
  }

  function onToggleFlag(flagId: string) {
    if (!proposal) return;
    const scope_flags = proposal.scope_flags.map((f) =>
      f.flag_id === flagId ? { ...f, checked: !f.checked } : f,
    );
    recalc({ ...proposal, scope_flags });
  }

  return (
    <main>
      <section className="hero">
        <p className="muted">Margin desk · scope risk · planned vs actual</p>
        <h1 className="brand">MarginDesk</h1>
        <p className="lede">
          Transforma proposta em decisão de margem: preço mínimo, margem esperada,
          risco de escopo, horas planejadas e acompanhamento do realizado — para
          prestadores que não querem descobrir o prejuízo no final do projeto.
        </p>
      </section>

      {error ? (
        <div className="notice">
          API indisponível ({error}). Suba o backend em <code>apps/api</code> na
          porta 8000.
        </div>
      ) : null}

      <section className="panel">
        <h2>Painel de lucro</h2>
        <div className="controls">
          <button type="button" disabled={pending} onClick={loadDemo}>
            {pending ? "Calculando…" : "Recarregar demo"}
          </button>
        </div>
        <div className="grid">
          <div className="kpi">
            <span>Projetos ativos</span>
            <strong>{summary?.active_projects ?? "—"}</strong>
          </div>
          <div className="kpi">
            <span>Margem planejada</span>
            <strong>
              {summary ? `${summary.avg_planned_margin_pct.toFixed(1)}%` : "—"}
            </strong>
          </div>
          <div className="kpi">
            <span>Margem realizada</span>
            <strong>
              {summary ? `${summary.avg_actual_margin_pct.toFixed(1)}%` : "—"}
            </strong>
          </div>
          <div className="kpi">
            <span>Pipeline</span>
            <strong className="money">
              {summary ? brl(summary.total_pipeline_value) : "—"}
            </strong>
          </div>
        </div>
      </section>

      <div className="layout-2">
        <MarginCalculator
          margin={margin}
          target={proposal?.target_margin_pct ?? 40}
          price={proposal?.price ?? 0}
          onPriceChange={onPriceChange}
        />
        <ScopeRiskChecklist
          flags={proposal?.scope_flags ?? []}
          riskLevel={margin?.risk_level ?? null}
          riskScore={margin?.risk_score ?? null}
          onToggle={onToggleFlag}
        />
      </div>

      <div className="layout-2">
        <ProposalPreview proposal={proposal} margin={margin} />
        <section className="panel">
          <h2>Biblioteca de custos</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Categoria</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {costLibrary.map((c) => (
                <tr key={c.cost_id}>
                  <td>
                    {c.label}
                    {c.recurring ? <div className="muted">recorrente</div> : null}
                  </td>
                  <td className="muted">{c.category}</td>
                  <td className="money">{brl(c.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <ProjectMarginTracker projects={projects} />
    </main>
  );
}
