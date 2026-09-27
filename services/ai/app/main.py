"""
AI Urban Mobility — FastAPI AI Engine
======================================
Main application entry point. Mounts all route modules and middleware.

Run with:
    uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import chat, prediction, itinerary

app = FastAPI(
    title="AI Urban Mobility Engine",
    description="AI-powered transit intelligence API — chat, predictions, itinerary planning",
    version="0.1.0",
)

# ── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Next.js dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(prediction.router, prefix="/prediction", tags=["Prediction"])
app.include_router(itinerary.router, prefix="/itinerary", tags=["Itinerary"])


# ── Health check ─────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok"}
