"""
Crowd prediction model (stub).
Returns random predictions until a real ML model is integrated.
"""

import random


def predict_crowd(route_id: str, stop_id: str, time: str | None = None) -> dict:
    """
    Predict crowd level for a given route/stop at a given time.

    # TODO: replace with real prediction model
    # This stub returns random values for prototyping. A real implementation
    # would use historical crowd_reports + vehicle_positions data to train
    # a time-series forecasting model (e.g., Prophet, LSTM, or gradient boosting).

    Returns:
        {
            "route_id": str,
            "stop_id": str,
            "crowd_level": "LOW" | "MEDIUM" | "HIGH",
            "predicted_occupancy": int (0-100),
            "confidence": float (0-1),
            "model": "stub_v0"
        }
    """
    crowd_level = random.choice(["LOW", "MEDIUM", "HIGH"])
    occupancy_ranges = {"LOW": (10, 35), "MEDIUM": (36, 65), "HIGH": (66, 95)}
    low, high = occupancy_ranges[crowd_level]

    return {
        "route_id": route_id,
        "stop_id": stop_id,
        "crowd_level": crowd_level,
        "predicted_occupancy": random.randint(low, high),
        "confidence": round(random.uniform(0.55, 0.95), 2),
        "model": "stub_v0",
    }
