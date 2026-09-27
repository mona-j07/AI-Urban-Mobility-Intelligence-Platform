"""
GPS Bus Simulator
=================
Moves simulated vehicles along their routes and writes live telemetry
to the `vehicle_positions` table in Supabase every 5 seconds.

Usage:
    cd services/simulator
    python gps/bus_simulator.py
"""

import sys
import os
import time
import math
import random
import signal

# Allow imports from the parent directory (services/simulator/)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from supabase_client import supabase

# ── Graceful shutdown ────────────────────────────────────────
_running = True


def _handle_signal(sig, frame):
    global _running
    print("\n⏹  Shutting down GPS simulator…")
    _running = False


signal.signal(signal.SIGINT, _handle_signal)
signal.signal(signal.SIGTERM, _handle_signal)

# ── Constants ────────────────────────────────────────────────
TICK_INTERVAL = 5          # seconds between position updates
STEP_DISTANCE = 0.0015     # ~150 m per tick in degrees (rough approximation)
CROWD_LEVELS = ["LOW", "MEDIUM", "HIGH"]


# ── Helpers ──────────────────────────────────────────────────

def _distance(lat1, lon1, lat2, lon2):
    """Simple Euclidean distance in degrees (sufficient for interpolation)."""
    return math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2)


def _lerp_toward(lat, lon, target_lat, target_lon, step):
    """Move (lat, lon) a fixed `step` toward the target. Returns new (lat, lon, arrived)."""
    d = _distance(lat, lon, target_lat, target_lon)
    if d <= step:
        return target_lat, target_lon, True
    ratio = step / d
    return (
        lat + (target_lat - lat) * ratio,
        lon + (target_lon - lon) * ratio,
        False,
    )


# ── Load vehicles + route paths from Supabase ───────────────

def load_vehicles():
    """Fetch all simulated vehicles and build their route paths."""
    print("📡 Loading simulated vehicles from Supabase…")
    res = supabase.table("vehicles").select("*").eq("is_simulated", True).execute()
    vehicles = res.data
    if not vehicles:
        print("⚠  No simulated vehicles found. Seed the database first (demo_data.sql).")
        sys.exit(0)

    print(f"   Found {len(vehicles)} simulated vehicle(s).")

    # Build path per route (ordered stops with coordinates)
    route_paths: dict[str, list[dict]] = {}

    for v in vehicles:
        rid = v["route_id"]
        if rid and rid not in route_paths:
            # Fetch ordered stops for this route
            rs_res = (
                supabase.table("route_stops")
                .select("sequence_number, stop_id, stops(id, name, latitude, longitude)")
                .eq("route_id", rid)
                .order("sequence_number")
                .execute()
            )
            path = []
            for rs in rs_res.data:
                stop = rs["stops"]
                if stop:
                    path.append({
                        "stop_id": stop["id"],
                        "name": stop["name"],
                        "lat": stop["latitude"],
                        "lon": stop["longitude"],
                    })
            route_paths[rid] = path
            print(f"   Route {rid[:8]}… → {len(path)} stop(s)")

    # Build per-vehicle state
    states = []
    for v in vehicles:
        rid = v["route_id"]
        path = route_paths.get(rid, [])
        if not path:
            print(f"   ⚠  Vehicle {v['vehicle_number']} has no route path, skipping.")
            continue
        states.append({
            "vehicle": v,
            "path": path,
            "path_index": 0,          # current target stop index
            "lat": path[0]["lat"],
            "lon": path[0]["lon"],
        })

    return states


# ── Main simulation loop ────────────────────────────────────

def run():
    states = load_vehicles()
    if not states:
        print("No vehicles to simulate. Exiting.")
        return

    print(f"\n🚌 GPS simulator running — {len(states)} vehicle(s), tick every {TICK_INTERVAL}s")
    print("   Press Ctrl+C to stop.\n")

    while _running:
        for s in states:
            v = s["vehicle"]
            path = s["path"]
            target = path[s["path_index"]]

            # Move toward the next stop
            new_lat, new_lon, arrived = _lerp_toward(
                s["lat"], s["lon"],
                target["lat"], target["lon"],
                STEP_DISTANCE,
            )
            s["lat"] = new_lat
            s["lon"] = new_lon

            if arrived:
                # Advance to next stop (loop back at end)
                s["path_index"] = (s["path_index"] + 1) % len(path)

            # Next stop info
            next_stop = path[s["path_index"]]
            speed = random.randint(15, 45)
            eta = random.randint(2, 15)
            crowd = random.choice(CROWD_LEVELS)

            # Insert telemetry row
            row = {
                "vehicle_id": v["id"],
                "route_id": v["route_id"],
                "latitude": round(new_lat, 6),
                "longitude": round(new_lon, 6),
                "speed": speed,
                "next_stop_id": next_stop["stop_id"],
                "eta_minutes": eta,
                "crowd_level": crowd,
                "is_simulated": True,
            }

            try:
                supabase.table("vehicle_positions").insert(row).execute()
            except Exception as e:
                print(f"   ❌ DB insert failed for {v['vehicle_number']}: {e}")

            print(
                f"  [{v['vehicle_number']}] "
                f"lat={new_lat:.4f} lng={new_lon:.4f} "
                f"speed={speed} eta={eta}min crowd={crowd} "
                f"→ {next_stop['name']}"
            )

        # Wait for next tick (check _running frequently for fast shutdown)
        for _ in range(TICK_INTERVAL * 10):
            if not _running:
                break
            time.sleep(0.1)

    print("✅ GPS simulator stopped.")


if __name__ == "__main__":
    run()
