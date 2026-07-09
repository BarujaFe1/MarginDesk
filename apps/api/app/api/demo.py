from fastapi import APIRouter

from app.models.schemas import DemoSummary, ProposalInput
from app.services import demo_data
from app.services.margin_engine import build_proposal_result, calculate_margin

router = APIRouter(tags=["demo"])


@router.get("/demo")
def get_demo() -> dict:
    proposal = ProposalInput.model_validate(demo_data.demo_proposal())
    margin = calculate_margin(proposal)
    projects = demo_data.demo_tracker_projects()
    at_risk = sum(1 for p in projects if p["alerts"])
    avg_planned = sum(p["planned_margin_pct"] for p in projects) / len(projects)
    avg_actual = sum(p["actual_margin_pct"] for p in projects) / len(projects)
    pipeline = sum(p["price"] for p in projects)

    summary = DemoSummary(
        proposals=3,
        active_projects=len(projects),
        avg_planned_margin_pct=round(avg_planned, 1),
        avg_actual_margin_pct=round(avg_actual, 1),
        at_risk_projects=at_risk,
        total_pipeline_value=round(pipeline, 2),
    )
    return {
        "summary": summary.model_dump(),
        "proposal": proposal.model_dump(),
        "margin": margin,
        "cost_library": demo_data.demo_cost_library(),
        "projects": projects,
    }


@router.get("/demo/proposal")
def get_demo_proposal() -> dict:
    proposal = ProposalInput.model_validate(demo_data.demo_proposal())
    return build_proposal_result(proposal, status="sent")
