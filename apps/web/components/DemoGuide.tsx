"use client";

type Step = {
  id: string;
  title: string;
  detail: string;
};

const STEPS: Step[] = [
  {
    id: "1",
    title: "Abrir Studio Norte",
    detail:
      "Proposta a R$ 14.500 com meta 42%. Mostre que a margem planejada fica abaixo do alvo e o preço mínimo aparece.",
  },
  {
    id: "2",
    title: "Mover o preço",
    detail:
      "Use o slider até o floor. Explique mão de obra + custos + contingência — não é feeling.",
  },
  {
    id: "3",
    title: "Marcar risco de escopo",
    detail:
      "Ligue/desligue flags (escopo aberto, rush, briefing). Score sobe e a recomendação muda.",
  },
  {
    id: "4",
    title: "Trocar para Agência Lume",
    detail:
      "No tracker, horas e custo realizados estouram — margem realizada cai. Dor = capacidade mal alocada.",
  },
  {
    id: "5",
    title: "Fechar o posicionamento",
    detail:
      "MarginDesk = decisão de margem. Não é ProposalRoom (aceite/PDF) nem AgendaYield (no-show/ocupação).",
  },
];

export function DemoGuide({
  activeStep,
  onSelect,
}: {
  activeStep: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="panel" aria-labelledby="demo-guide-title">
      <h2 id="demo-guide-title">Roteiro de demo (≈4 min)</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Guia para entrevista: valor em margem e risco, sem fingir SaaS de produção.
      </p>
      <ol className="demo-guide-list">
        {STEPS.map((step) => {
          const selected = step.id === activeStep;
          return (
            <li key={step.id}>
              <button
                type="button"
                className={selected ? "demo-step active" : "demo-step"}
                aria-current={selected ? "step" : undefined}
                onClick={() => onSelect(step.id)}
              >
                <span className="demo-step-num">{step.id}</span>
                <span>
                  <strong>{step.title}</strong>
                  <span className="muted demo-step-detail">{step.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
