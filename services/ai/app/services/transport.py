"""
Transport data service.
Queries Supabase for route, vehicle, and crowd data.
"""

from app.services.supabase_client import supabase


def get_route_by_stops(origin_stop_id: str, destination_stop_id: str) -> dict | None:
    """
    Find a route that connects both stops.
    Simple approach: check if both stop_ids exist in the same route's route_stops.
    Returns the first matching route dict, or None.
    """
    # Get all route_stops for the origin
    origin_res = (
        supabase.table("route_stops")
        .select("route_id")
        .eq("stop_id", origin_stop_id)
        .execute()
    )
    origin_route_ids = {rs["route_id"] for rs in origin_res.data}

    if not origin_route_ids:
        return None

    # Get all route_stops for the destination
    dest_res = (
        supabase.table("route_stops")
        .select("route_id")
        .eq("stop_id", destination_stop_id)
        .execute()
    )
    dest_route_ids = {rs["route_id"] for rs in dest_res.data}

    # Find intersection
    common_route_ids = origin_route_ids & dest_route_ids
    if not common_route_ids:
        return None

    # Fetch the first matching route's details
    route_id = next(iter(common_route_ids))
    route_res = (
        supabase.table("routes")
        .select("*")
        .eq("id", route_id)
        .single()
        .execute()
    )
    return route_res.data


def get_live_vehicles(route_id: str) -> list[dict]:
    """
    Get the latest vehicle_positions for each vehicle on a given route.
    Simple approach: fetch recent positions ordered by updated_at desc, limit to
    a reasonable number. Not a perfect "latest per group" query, but sufficient
    for the prototype.
    """
    res = (
        supabase.table("vehicle_positions")
        .select("*, vehicles(vehicle_number)")
        .eq("route_id", route_id)
        .order("updated_at", desc=True)
        .limit(20)
        .execute()
    )
    return res.data


def get_crowd_prediction(route_id: str, stop_id: str) -> dict | None:
    """
    Get the most recent crowd prediction for a route/stop pair.
    """
    res = (
        supabase.table("crowd_predictions")
        .select("*")
        .eq("route_id", route_id)
        .eq("stop_id", stop_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if res.data:
        return res.data[0]
    return None


def get_stop(stop_id: str) -> dict | None:
    """Fetch a single stop by ID."""
    res = (
        supabase.table("stops")
        .select("*")
        .eq("id", stop_id)
        .single()
        .execute()
    )
    return res.data


def get_all_route_stops() -> list[dict]:
    """Fetch all route_stops with stop coordinates, for building the graph."""
    res = (
        supabase.table("route_stops")
        .select("route_id, stop_id, sequence_number")
        .order("route_id")
        .order("sequence_number")
        .execute()
    )
    return res.data
