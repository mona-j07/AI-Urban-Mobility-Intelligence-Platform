"""
Chat route — natural-language travel assistant.
POST /chat with {"message": str} to get AI-generated itinerary suggestions.
Falls back to hardcoded stub if the Anthropic call fails.
"""

from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.travel_agent import get_travel_plan, get_travel_plan_ai

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    options: list[dict]
    source: str  # "ai" or "fallback"


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Accept a natural-language travel query and return itinerary options.
    Tries the AI-powered agent first; falls back to the hardcoded stub
    if the Anthropic call fails or returns malformed JSON.
    """
    try:
        options = get_travel_plan_ai(req.message)
        return ChatResponse(options=options, source="ai")
    except Exception as e:
        print(f"[WARN] AI travel plan failed, using fallback: {e}")
        options = get_travel_plan(req.message)
        return ChatResponse(options=options, source="fallback")
