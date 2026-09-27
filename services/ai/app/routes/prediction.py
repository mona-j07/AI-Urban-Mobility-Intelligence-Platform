"""
Prediction routes — crowd and demand forecasting endpoints.
"""

import random
from fastapi import APIRouter, Query

from app.models.crowd_model import predict_crowd

router = APIRouter()


@router.get("/crowd")
async def crowd_prediction(
    route_id: str = Query(..., description="Route UUID"),
    stop_id: str = Query(..., description="Stop UUID"),
):
    """
    GET /prediction/crowd?route_id=...&stop_id=...
    Returns a crowd-level prediction for the given route/stop.
    """
    prediction = predict_crowd(route_id, stop_id)
    return prediction


@router.get("/demand")
async def demand_prediction(
    route_id: str = Query(..., description="Route UUID"),
):
    """
    GET /prediction/demand?route_id=...
    Returns a demand prediction for the given route.

    # TODO: replace with real model
    # This stub returns random values for prototyping. A real implementation
    # would use historical ridership data to forecast passenger demand.
    """
    return {
        "route_id": route_id,
        "predicted_demand": random.randint(50, 200),
        "time_horizon_minutes": 60,
        "confidence": round(random.uniform(0.5, 0.9), 2),
        "model": "stub_v0",
    }
