"""API tests for MarginDesk margin engine and endpoints."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.models.schemas import ProposalInput
from app.services import demo_data
from app.services.margin_engine import calculate_margin

client = TestClient(app)


def test_health() -> None:
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_margin_math_demo_proposal() -> None:
    proposal = ProposalInput.model_validate(demo_data.demo_proposal())
    margin = calculate_margin(proposal)

    labor = 28 * 120 + 40 * 140 + 8 * 100  # 3360 + 5600 + 800 = 9760
    costs = 180 + 120 + 90  # 390
    avg_rate = labor / 76
    contingency = 6 * avg_rate
    total = labor + costs + contingency
    profit = 14500 - total
    expected_pct = profit / 14500 * 100

    assert margin["labor_cost"] == labor
    assert margin["direct_costs"] == costs
    assert abs(margin["margin_pct"] - round(expected_pct, 2)) < 0.02
    assert margin["risk_level"] in {"low", "medium", "high", "critical"}
    assert "Escopo aberto" in " ".join(margin["risk_flags_triggered"])


def test_calculate_endpoint() -> None:
    payload = demo_data.demo_proposal()
    res = client.post("/api/margin/calculate", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert "margin" in body
    assert body["margin"]["total_cost"] > 0


def test_demo_endpoint() -> None:
    res = client.get("/api/demo")
    assert res.status_code == 200
    body = res.json()
    assert body["summary"]["active_projects"] == 3
    assert len(body["projects"]) == 3


def test_tracker_endpoint() -> None:
    res = client.get("/api/tracker")
    assert res.status_code == 200
    assert res.json()["count"] == 3


def test_min_price_for_target() -> None:
    proposal = ProposalInput.model_validate(demo_data.demo_proposal())
    proposal.price = 1.0  # force below target
    margin = calculate_margin(proposal)
    assert margin["min_price_for_target"] > margin["total_cost"]
    assert margin["price_gap_to_target"] > 0
