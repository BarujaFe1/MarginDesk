from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


RiskLevel = Literal["low", "medium", "high", "critical"]
ProposalStatus = Literal["draft", "sent", "accepted", "declined", "in_delivery"]


class CostItem(BaseModel):
    cost_id: str
    label: str
    category: str
    amount: float = Field(ge=0)
    recurring: bool = False


class ServiceLine(BaseModel):
    service_id: str
    name: str
    hours: float = Field(ge=0)
    hourly_rate: float = Field(ge=0)
    notes: str = ""


class ScopeRiskFlag(BaseModel):
    flag_id: str
    label: str
    checked: bool = False
    weight: float = Field(ge=0, le=25)
    mitigation: str = ""


class ProposalInput(BaseModel):
    proposal_id: str | None = None
    client_name: str
    project_title: str
    niche: str = "general"
    currency: str = "BRL"
    target_margin_pct: float = Field(default=40.0, ge=0, le=95)
    price: float = Field(ge=0)
    services: list[ServiceLine]
    costs: list[CostItem] = []
    scope_flags: list[ScopeRiskFlag] = []
    contingency_hours: float = Field(default=0.0, ge=0)
    payment_terms: str = "50% upfront / 50% on delivery"
    exclusions: list[str] = []


class MarginBreakdown(BaseModel):
    labor_cost: float
    direct_costs: float
    contingency_cost: float
    total_cost: float
    price: float
    profit: float
    margin_pct: float
    min_price_for_target: float
    price_gap_to_target: float
    planned_hours: float
    effective_hourly: float
    risk_score: float
    risk_level: RiskLevel
    risk_flags_triggered: list[str]
    recommendation: str


class ProposalResult(BaseModel):
    proposal: ProposalInput
    margin: MarginBreakdown
    status: ProposalStatus = "draft"
    public_slug: str | None = None


class TrackerEntry(BaseModel):
    project_id: str
    proposal_id: str
    client_name: str
    project_title: str
    planned_hours: float
    actual_hours: float
    planned_cost: float
    actual_cost: float
    price: float
    planned_margin_pct: float
    actual_margin_pct: float
    scope_change_count: int = 0
    status: ProposalStatus = "in_delivery"
    alerts: list[str] = []


class DemoSummary(BaseModel):
    proposals: int
    active_projects: int
    avg_planned_margin_pct: float
    avg_actual_margin_pct: float
    at_risk_projects: int
    total_pipeline_value: float
