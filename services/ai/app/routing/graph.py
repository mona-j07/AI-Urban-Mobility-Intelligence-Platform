"""
Route graph — adjacency structure and BFS shortest path.

On import, attempts to load data/demo/routes.json for a static graph.
Falls back to building the graph dynamically from Supabase route_stops.

NOTE: BFS is used instead of Dijkstra because we don't have real weighted
edges yet. This is sufficient for the prototype — replace with Dijkstra
or A* when travel-time weights are available.
"""

import json
import os
from collections import deque


# ── Build adjacency from route_stops data ────────────────────

def _build_adjacency(route_stops_data: list[dict]) -> dict[str, list[tuple[str, str]]]:
    """
    Build {stop_id: [(neighbor_stop_id, route_id), ...]} from route_stops rows.
    Consecutive stops in the same route are connected bidirectionally.
    """
    adjacency: dict[str, list[tuple[str, str]]] = {}

    # Group by route_id
    routes: dict[str, list[dict]] = {}
    for rs in route_stops_data:
        rid = rs["route_id"]
        routes.setdefault(rid, []).append(rs)

    # Sort each route's stops by sequence_number and connect consecutive pairs
    for rid, stops in routes.items():
        stops.sort(key=lambda s: s["sequence_number"])
        for i in range(len(stops) - 1):
            a = stops[i]["stop_id"]
            b = stops[i + 1]["stop_id"]
            adjacency.setdefault(a, []).append((b, rid))
            adjacency.setdefault(b, []).append((a, rid))

    return adjacency


# ── Try to load static graph from JSON ───────────────────────

_DEMO_PATH = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "data", "demo", "routes.json")
)

_adjacency: dict[str, list[tuple[str, str]]] = {}

try:
    if os.path.exists(_DEMO_PATH):
        with open(_DEMO_PATH, "r") as f:
            data = json.load(f)
        if isinstance(data, list) and len(data) > 0:
            _adjacency = _build_adjacency(data)
            print(f"[GRAPH] Loaded from {_DEMO_PATH}: {len(_adjacency)} node(s)")
        else:
            print("[GRAPH] routes.json is empty -- graph will be built on first request")
except Exception as e:
    print(f"[WARN] Could not load routes.json: {e}")


def ensure_graph():
    """Build the graph from Supabase if it hasn't been loaded from JSON."""
    global _adjacency
    if _adjacency:
        return

    try:
        from app.services.transport import get_all_route_stops
        data = get_all_route_stops()
        _adjacency = _build_adjacency(data)
        print(f"[GRAPH] Built from Supabase: {len(_adjacency)} node(s)")
    except Exception as e:
        print(f"[WARN] Could not build graph from Supabase: {e}")


def shortest_path(origin_stop_id: str, dest_stop_id: str) -> list[dict] | None:
    """
    BFS shortest path from origin to destination.
    Returns a list of {stop_id, route_id} dicts representing the path,
    or None if no path exists.
    """
    ensure_graph()

    if origin_stop_id not in _adjacency or dest_stop_id not in _adjacency:
        return None

    if origin_stop_id == dest_stop_id:
        return [{"stop_id": origin_stop_id, "route_id": None}]

    visited = {origin_stop_id}
    # Queue entries: (current_stop_id, path_so_far)
    queue = deque([(origin_stop_id, [{"stop_id": origin_stop_id, "route_id": None}])])

    while queue:
        current, path = queue.popleft()
        for neighbor, route_id in _adjacency.get(current, []):
            if neighbor in visited:
                continue
            visited.add(neighbor)
            new_path = path + [{"stop_id": neighbor, "route_id": route_id}]
            if neighbor == dest_stop_id:
                return new_path
            queue.append((neighbor, new_path))

    return None
