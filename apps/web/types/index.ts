export type RiskLevel = "low" | "medium" | "high" | "critical";
export type ProposalStatus = "draft" | "sent" | "accepted" | "declined" | "in_delivery";

export interface CostItem {
  cost_id: string;
  label: string;
  category: string;
  amount: number;
  recurring: boolean;
}

export interface ServiceLine {
  service_id: string;
  name: string;
  hours: number;
  hourly_rate: number;
  notes: string;
}

export interface ScopeRiskFlag {
  flag_id: string;
  label: string;
  checked: boolean;
  weight: number;
  mitigation: string;
}

export interface ProposalInput {
  proposal_id?: string | null;
  client_name: string;
  project_title: string;
  niche: string;
  currency: string;
  target_margin_pct: number;
  price: number;
  services: ServiceLine[];
  costs: CostItem[];
  scope_flags: ScopeRiskFlag[];
  contingency_hours: number;
  payment_terms: string;
  exclusions: string[];
}

export interface MarginBreakdown {
  labor_cost: number;
  direct_costs: number;
  contingency_cost: number;
  total_cost: number;
  price: number;
  profit: number;
  margin_pct: number;
  min_price_for_target: number;
  price_gap_to_target: number;
  planned_hours: number;
  effective_hourly: number;
  risk_score: number;
  risk_level: RiskLevel;
  risk_flags_triggered: string[];
  recommendation: string;
}

export interface TrackerProject {
  project_id: string;
  proposal_id: string;
  client_name: string;
  project_title: string;
  planned_hours: number;
  actual_hours: number;
  planned_cost: number;
  actual_cost: number;
  price: number;
  planned_margin_pct: number;
  actual_margin_pct: number;
  scope_change_count: number;
  status: ProposalStatus;
  alerts: string[];
}

export interface DemoSummary {
  proposals: number;
  active_projects: number;
  avg_planned_margin_pct: number;
  avg_actual_margin_pct: number;
  at_risk_projects: number;
  total_pipeline_value: number;
}

export interface DemoResponse {
  summary: DemoSummary;
  proposal: ProposalInput;
  /** Full lab catalog — three synthetic proposals. */
  proposals?: ProposalInput[];
  margin: MarginBreakdown;
  cost_library: CostItem[];
  projects: TrackerProject[];
}
