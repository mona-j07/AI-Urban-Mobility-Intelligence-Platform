# AI Engine Service

FastAPI-based AI engine for the Urban Mobility Intelligence Platform. Provides chat-based trip planning, crowd/demand predictions, and multi-modal itinerary generation.

## Setup

```bash
cd services/ai

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

```bash
uvicorn app.main:app --reload --port 8000
```

The server will start at `http://localhost:8000`. Interactive API docs are available at `http://localhost:8000/docs`.

## Endpoints

### Health Check

```bash
curl http://localhost:8000/health
# → {"status": "ok"}
```

### Chat (AI Travel Assistant)

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I get from SSN College to Marina Beach?"}'
# → {"options": [...], "source": "ai"}
```

### Crowd Prediction

```bash
curl "http://localhost:8000/prediction/crowd?route_id=a1b2c3d4-0001-4000-8000-000000000001&stop_id=b1b2c3d4-0005-4000-8000-000000000005"
# → {"route_id": "...", "crowd_level": "MEDIUM", "predicted_occupancy": 42, ...}
```

### Demand Prediction

```bash
curl "http://localhost:8000/prediction/demand?route_id=a1b2c3d4-0001-4000-8000-000000000001"
# → {"route_id": "...", "predicted_demand": 132, ...}
```

### Itinerary Planning

```bash
curl -X POST http://localhost:8000/itinerary/plan \
  -H "Content-Type: application/json" \
  -d '{"origin_stop_id": "b1b2c3d4-0001-4000-8000-000000000001", "destination_stop_id": "b1b2c3d4-0009-4000-8000-000000000009"}'
# → {"origin": {...}, "destination": {...}, "options": [...], "path": [...]}
```

## Prerequisites

- `services/ai/.env` must contain `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MAP_API_KEY`, and `AI_API_KEY`
- Database must be seeded with routes, stops, and route_stops (run `demo_data.sql` first)
- OpenRouteService API key for real distance/duration (falls back to estimates if unavailable)
- Anthropic API key for AI-powered chat (falls back to hardcoded responses if unavailable)

## Architecture

```
app/
├── main.py              # FastAPI app + CORS + routers
├── routes/
│   ├── chat.py          # POST /chat — AI travel assistant
│   ├── prediction.py    # GET /prediction/crowd, /prediction/demand
│   └── itinerary.py     # POST /itinerary/plan
├── agents/
│   └── travel_agent.py  # Anthropic-powered + stub fallback
├── routing/
│   ├── graph.py         # BFS shortest path over stop graph
│   └── ors_client.py    # OpenRouteService directions client
├── models/
│   └── crowd_model.py   # Crowd prediction (stub)
└── services/
    ├── supabase_client.py  # Supabase service-role client
    └── transport.py        # Route/vehicle/crowd data queries
```
