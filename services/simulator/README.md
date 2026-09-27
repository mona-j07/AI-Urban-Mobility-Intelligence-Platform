# Simulator Service

Two independent Python scripts that generate live simulated data and write it to Supabase.

## Scripts

| Script | What it does | Frequency |
|---|---|---|
| `gps/bus_simulator.py` | Moves simulated vehicles along their routes, writes telemetry to `vehicle_positions` | Every 5 seconds |
| `crowd/crowd_simulator.py` | Generates random crowd-level reports for each simulated vehicle, writes to `crowd_reports` | Every 30 seconds |

Both scripts use `supabase_client.py` to connect with the **service-role key** (required for RLS-bypassing writes).

## Setup

```bash
cd services/simulator

# Create and activate a virtual environment
python -m venv venv

# Linux / macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Running

Run each script in a **separate terminal** (both need the venv activated):

```bash
# Terminal 1 — GPS telemetry
python gps/bus_simulator.py

# Terminal 2 — Crowd reports
python crowd/crowd_simulator.py
```

Press **Ctrl+C** to stop either script gracefully.

## Prerequisites

- The database must be seeded with routes, stops, route_stops, and vehicles (run `demo_data.sql` first).
- `services/simulator/.env` must contain `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
