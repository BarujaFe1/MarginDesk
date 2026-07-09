from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import demo, health, margin, proposals, tracker

app = FastAPI(
    title="MarginDesk API",
    description=(
        "Service proposal margin desk: briefing, costs, hours, price, "
        "scope risk and planned-vs-actual profitability tracking."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(demo.router, prefix="/api")
app.include_router(margin.router, prefix="/api")
app.include_router(proposals.router, prefix="/api")
app.include_router(tracker.router, prefix="/api")
