from fastapi import APIRouter

from app.models.schemas import ProposalInput
from app.services.margin_engine import build_proposal_result

router = APIRouter(tags=["proposals"])


@router.post("/proposals/preview")
def preview_proposal(proposal: ProposalInput) -> dict:
    """Build a margin-aware proposal preview (local MVP, no persistence)."""
    status = "draft"
    return build_proposal_result(proposal, status=status)
