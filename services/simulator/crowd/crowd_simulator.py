"""
Crowd Simulator
===============
Generates periodic crowd-level reports for all simulated vehicles and
writes them to the `crowd_reports` table in Supabase every 30 seconds.

Usage:
    cd services/simulator
    python crowd/crowd_simulator.py
"""

import sys
import os
import time
import random
import signal

# Allow imports from the parent directory (services/simulator/)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from supabase_client import supabase

# ── Graceful shutdown ────────────────────────────────────────
_running = True


def _handle_signal(sig, frame):
    global _running
    print("\n⏹  Shutting down crowd simulator…")
    _running = False


signal.signal(signal.SIGINT, _handle_signal)
signal.signal(signal.SIGTERM, _handle_signal)

# ── Constants ────────────────────────────────────────────────
TICK_INTERVAL = 30  # seconds between crowd reports
CROWD_LEVELS = ["LOW", "MEDIUM", "HIGH"]


# ── Main loop ───────────────────────────────────────────────

def run():
    print("📡 Loading simulated vehicles from Supabase…")
    res = supabase.table("vehicles").select("id, vehicle_number").eq("is_simulated", True).execute()
    vehicles = res.data

    if not vehicles:
        print("⚠  No simulated vehicles found. Seed the database first (demo_data.sql).")
        sys.exit(0)

    print(f"   Found {len(vehicles)} simulated vehicle(s).")
    print(f"\n👥 Crowd simulator running — reporting every {TICK_INTERVAL}s")
    print("   Press Ctrl+C to stop.\n")

    while _running:
        for v in vehicles:
            crowd = random.choice(CROWD_LEVELS)
            row = {
                "vehicle_id": v["id"],
                "crowd_level": crowd,
            }

            try:
                supabase.table("crowd_reports").insert(row).execute()
                print(f"  [{v['vehicle_number']}] crowd_level={crowd}")
            except Exception as e:
                print(f"   ❌ DB insert failed for {v['vehicle_number']}: {e}")

        # Wait for next tick (check _running frequently for fast shutdown)
        for _ in range(TICK_INTERVAL * 10):
            if not _running:
                break
            time.sleep(0.1)

    print("✅ Crowd simulator stopped.")


if __name__ == "__main__":
    run()
