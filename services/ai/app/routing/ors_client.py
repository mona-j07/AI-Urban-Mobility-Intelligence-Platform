"""
OpenRouteService (ORS) client.
Calls the Directions API for real driving distance and duration.
Falls back gracefully on any error so the itinerary endpoint never 500s.
"""

import os
import httpx
from dotenv import load_dotenv

# Load MAP_API_KEY from services/ai/.env
_env_path = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
)
load_dotenv(_env_path)

MAP_API_KEY = os.getenv("MAP_API_KEY", "")

ORS_DIRECTIONS_URL = "https://api.openrouteservice.org/v2/directions/driving-car"

_FALLBACK = {
    "distance_km": None,
    "duration_minutes": None,
    "source": "fallback",
}


async def get_directions(
    origin_lat: float,
    origin_lng: float,
    dest_lat: float,
    dest_lng: float,
) -> dict:
    """
    Call ORS Directions API for driving distance/duration between two points.

    Returns:
        {
            "distance_km": float,
            "duration_minutes": float,
            "source": "openrouteservice"
        }
    On any error (network, quota, missing key), returns the fallback dict
    so the caller never has to handle exceptions.
    """
    if not MAP_API_KEY:
        print("⚠  MAP_API_KEY not set — returning fallback directions")
        return _FALLBACK

    try:
        body = {
            "coordinates": [
                [origin_lng, origin_lat],  # ORS uses [lng, lat] order
                [dest_lng, dest_lat],
            ]
        }
        headers = {
            "Authorization": MAP_API_KEY,
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(ORS_DIRECTIONS_URL, json=body, headers=headers)

        if resp.status_code != 200:
            print(f"⚠  ORS returned {resp.status_code}: {resp.text[:200]}")
            return _FALLBACK

        data = resp.json()
        summary = data["routes"][0]["summary"]

        return {
            "distance_km": round(summary["distance"] / 1000, 2),
            "duration_minutes": round(summary["duration"] / 60, 1),
            "source": "openrouteservice",
        }

    except Exception as e:
        print(f"⚠  ORS directions failed: {e}")
        return _FALLBACK
