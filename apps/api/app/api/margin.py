from fastapi import APIRouter

from app.models.schemas import ProposalInput
from app.services.margin_engine import calculate_margin

router = APIRouter(tags=["margin"])


@router.post("/margin/calculate")
def post_calculate(proposal: ProposalInput) -> dict:
    return {"margin": calculate_margin(proposal), "proposal_id": proposal.proposal_id}
