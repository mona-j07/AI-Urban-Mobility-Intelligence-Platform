"""
Travel agent — generates itinerary options.
Provides both a hardcoded stub and a real Anthropic-powered version.
"""

import json
import os
import random
from dotenv import load_dotenv

# Load AI_API_KEY from services/ai/.env
_env_path = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
)
load_dotenv(_env_path)

AI_API_KEY = os.getenv("AI_API_KEY", "")


def get_travel_plan(query: str) -> list[dict]:
    """
    Hardcoded stub that returns 3 itinerary options.
    Used as a fallback when the AI call fails or during offline development.

    # TODO: wire to Anthropic API using AI_API_KEY
    # This function is intentionally a stub. Use get_travel_plan_ai() for
    # the real AI-powered version.
    """
    return [
        {
            "label": "FASTEST",
            "duration_minutes": random.randint(20, 35),
            "fare": 25.0,
            "crowd_level": "MEDIUM",
            "description": f"Direct bus route for: {query}",
        },
        {
            "label": "CHEAPEST",
            "duration_minutes": random.randint(35, 55),
            "fare": 15.0,
            "crowd_level": "HIGH",
            "description": f"Budget-friendly route with one transfer for: {query}",
        },
        {
            "label": "LEAST_CROWDED",
            "duration_minutes": random.randint(30, 50),
            "fare": 30.0,
            "crowd_level": "LOW",
            "description": f"Comfortable route avoiding peak crowds for: {query}",
        },
    ]


def get_travel_plan_ai(query: str) -> list[dict]:
    """
    Call the Anthropic Messages API to generate a context-aware travel plan.
    Uses claude-sonnet-4-6 with a system prompt that enforces JSON output
    matching the TripOption shape.

    Returns a list of itinerary option dicts, or raises on failure
    (caller should catch and fall back to get_travel_plan).
    """
    import anthropic

    if not AI_API_KEY:
        raise ValueError("AI_API_KEY not set — cannot call Anthropic API")

    client = anthropic.Anthropic(api_key=AI_API_KEY)

    system_prompt = """You are a Chennai urban transit assistant. The user will ask about
traveling between locations in Chennai, India. You must respond with ONLY a JSON array
(no markdown, no explanation, no code fences) containing exactly 3 itinerary options.

Each option must match this exact shape:
{
  "label": "FASTEST" | "CHEAPEST" | "LEAST_CROWDED",
  "duration_minutes": <integer>,
  "fare": <number in INR>,
  "crowd_level": "LOW" | "MEDIUM" | "HIGH",
  "description": "<one-line description of the route>"
}

Use realistic Chennai transit details:
- Bus routes like 21G, 23C, 5C, 27H, etc.
- Metro line M1 (Airport–Washermanpet)
- Landmarks: SSN College, Kelambakkam, OMR, Sholinganallur, Adyar, Mylapore, Marina Beach, T. Nagar, Central Station
- Fares: buses ₹10-30, metro ₹20-60
- Durations: realistic for Chennai traffic (buses 30-90 min, metro 15-40 min)

Respond with ONLY the JSON array. No other text."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=[
            {"role": "user", "content": query}
        ],
    )

    # Extract the text content
    response_text = message.content[0].text.strip()

    # Parse the JSON (may raise json.JSONDecodeError)
    options = json.loads(response_text)

    # Validate basic structure
    if not isinstance(options, list) or len(options) == 0:
        raise ValueError("AI returned invalid itinerary structure")

    for opt in options:
        if not all(k in opt for k in ("label", "duration_minutes", "fare", "crowd_level")):
            raise ValueError(f"AI option missing required fields: {opt}")

    return options
