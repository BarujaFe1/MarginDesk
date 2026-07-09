from fastapi import APIRouter

from app.services import demo_data

router = APIRouter(tags=["tracker"])


@router.get("/tracker")
def list_tracker() -> dict:
    projects = demo_data.demo_tracker_projects()
    return {
        "projects": projects,
        "count": len(projects),
        "at_risk": sum(1 for p in projects if p["alerts"]),
    }
