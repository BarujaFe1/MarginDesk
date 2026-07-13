"use client";

import { useEffect, useState, useTransition } from "react";
import { DemoGuide } from "@/components/DemoGuide";
import { MarginCalculator } from "@/components/MarginCalculator";
import { ProjectMarginTracker } from "@/components/ProjectMarginTracker";
import { ProposalPreview } from "@/components/ProposalPreview";
import { ScopeRiskChecklist } from "@/components/ScopeRiskChecklist";
import { calculateMargin, fetchDemo } from "@/lib/api";
import { brl, pct } from "@/lib/format";
import type {
  CostItem,
  DemoSummary,
  MarginBreakdown,
  ProposalInput,
  TrackerProject,
} from "@/types";

export default function HomePage() {
  const [summary, setSummary] = useState<DemoSummary | null>(null);
  const [proposals, setProposals] = useState<ProposalInput[]>([]);
  const [proposal, setProposal] = useState<ProposalInput | null>(null);
  const [margin, setMargin] = useState<MarginBreakdown | null>(null);
  const [projects, setProjects] = useState<TrackerProject[]>([]);
  const [costLibrary, setCostLibrary] = useState<CostItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [guideStep, setGuideStep] = useState("1");
  const [pending, startTransition] = useTransition();

  function loadDemo(activeId?: string) {
    startTransition(async () => {
      try {
        setError(null);
        const data = await fetchDemo(activeId);
        const catalog = data.proposals?.length
          ? data.proposals
          : data.proposal
            ? [data.proposal]
            : [];
        setProposals(catalog);
        setSummary(data.summary);
        setProjects(data.projects);
        setCostLibrary(data.cost_library);

        const active =
          (activeId ? catalog.find((p) => p.proposal_id === activeId) : null) ??
          catalog.find((p) => p.proposal_id === data.proposal.proposal_id) ??
          catalog[0] ??
          data.proposal;

        setProposal(active);
        if (active.proposal_id === data.proposal.proposal_id) {
          setMargin(data.margin);
        } else {
          const res = await calculateMargin(active);
          setMargin(res.margin);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load MarginDesk");
      } finally {
        setBooting(false);
      }
    });
  }

  useEffect(() => {
    loadDemo();
  }, []);

  function selectProposal(id: string) {
    const next = proposals.find((p) => p.proposal_id === id);
    if (!next) return;
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

  function recalc(next: ProposalInput) {
    startTransition(async () => {
      try {
        setError(null);
        setProposal(next);
        setProposals((prev) =>
          prev.map((p) => (p.proposal_id === next.proposal_id ? next : p)),
        );
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

  function onGuideSelect(stepId: string) {
    setGuideStep(stepId);
    if (stepId === "1" || stepId === "2" || stepId === "3") {
      const norte = proposals.find((p) => p.proposal_id === "prop-demo-001");
      if (norte?.proposal_id) selectProposal(norte.proposal_id);
    }
    if (stepId === "4") {
      const lume = proposals.find((p) => p.proposal_id === "prop-demo-002");
      if (lume?.proposal_id) selectProposal(lume.proposal_id);
    }
  }

  const busy = pending || booting;

  return (
    <main>
      <div className="lab-banner" role="note">
        <strong>Lab demo</strong> — dados sintéticos, motor de margem no browser.
        Foco em <em>preço mínimo / risco / lucro</em>. Não é gerador de PDF
        (ProposalRoom), nem yield de agenda (AgendaYield), nem ERP/CRM.
      </div>

      <section className="hero">
        <p className="muted">MVP lab · margin desk · scope risk · planned vs actual</p>
        <h1 className="brand">MarginDesk</h1>
        <p className="lede">
          Transforma proposta em decisão de margem: preço mínimo, margem esperada,
          risco de escopo, horas planejadas e acompanhamento do realizado — para
          prestadores que não querem descobrir o prejuízo no final do projeto.
        </p>
      </section>

      {error ? (
        <div className="notice" role="alert">
          Falha ao carregar o lab ({error}). O motor client-side deve funcionar
          offline; se o erro persistir, recarregue a página.
        </div>
      ) : null}

      <DemoGuide activeStep={guideStep} onSelect={onGuideSelect} />

      <section className="panel" aria-labelledby="demo-proposals-title">
        <h2 id="demo-proposals-title">3 propostas demo</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: "0.85rem" }}>
          Selecione um caso sintético para inspecionar floor de preço, risco de
          escopo e lucro planejado. Valores planejados vêm do mesmo motor de margem.
        </p>
        <div
          className="proposal-switcher"
          role="tablist"
          aria-label="Propostas demo"
        >
          {busy && proposals.length === 0
            ? [0, 1, 2].map((i) => <div key={i} className="skeleton-card" />)
            : proposals.map((p) => {
                const active = p.proposal_id === proposal?.proposal_id;
                return (
                  <button
                    key={p.proposal_id ?? p.project_title}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={active ? "proposal-card active" : "proposal-card"}
                    disabled={busy}
                    onClick={() => p.proposal_id && selectProposal(p.proposal_id)}
                  >
                    <strong>{p.project_title}</strong>
                    <span className="muted">{p.client_name}</span>
                    <span className="money">{brl(p.price)}</span>
                    <span className="muted">meta {p.target_margin_pct}%</span>
                  </button>
                );
              })}
        </div>
      </section>

      <section className="panel" aria-labelledby="profit-panel-title">
        <h2 id="profit-panel-title">Painel de lucro</h2>
        <div className="controls">
          <button
            type="button"
            disabled={busy}
            onClick={() => loadDemo(proposal?.proposal_id ?? undefined)}
          >
            {busy ? "Calculando…" : "Recarregar demo"}
          </button>
        </div>
        <div className="grid">
          <div className="kpi">
            <span>Propostas demo</span>
            <strong>{summary?.proposals ?? (proposals.length || "—")}</strong>
          </div>
          <div className="kpi">
            <span>Margem planejada</span>
            <strong>
              {summary ? pct(summary.avg_planned_margin_pct) : "—"}
            </strong>
          </div>
          <div className="kpi">
            <span>Margem realizada</span>
            <strong>
              {summary ? pct(summary.avg_actual_margin_pct) : "—"}
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
        <section className="panel" aria-labelledby="cost-lib-title">
          <h2 id="cost-lib-title">Biblioteca de custos</h2>
          {costLibrary.length === 0 ? (
            <div className="skeleton-block" />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Valor</th>
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
            </div>
          )}
        </section>
      </div>

      <ProjectMarginTracker projects={projects} />
    </main>
  );
}
