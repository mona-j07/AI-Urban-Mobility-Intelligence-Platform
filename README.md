# AI Urban Mobility Intelligence Platform

A full-stack urban mobility analytics platform with real-time traffic simulation, AI-powered insights, and interactive map visualisation.

## Repository Structure

The repo is a multi-service monorepo with **four independently-runnable parts**:

| Directory | What it is | Env file |
|---|---|---|
| `apps/web/` | Next.js 14 PWA (TypeScript, Tailwind, shadcn/ui) — the user-facing dashboard | `apps/web/.env.local` |
| `services/ai/` | FastAPI AI engine — Anthropic LLM + OpenRouteService routing | `services/ai/.env` |
| `services/simulator/` | Python traffic simulator — writes live data to Supabase | `services/simulator/.env` |
| `supabase/` | Database migrations, seed data, and RLS policies | _(uses Supabase CLI or dashboard)_ |

Other directories:

- `shared/types/` — shared TypeScript/Python type definitions
- `data/demo/` — demo datasets and fixtures
- `docs/` — architecture docs and design notes

## Quick Start

> **Prerequisites:** Node.js ≥ 18, Python ≥ 3.11, a Supabase project, an OpenRouteService key, and an Anthropic API key. See `.env.example` for all required variables.

```bash
# 1. Clone and install
git clone <repo-url> && cd ai-urban-mobility

# 2. Copy env files and fill in your keys
cp .env.example apps/web/.env.local   # edit with real values
cp .env.example services/ai/.env      # edit with real values
cp .env.example services/simulator/.env # edit with real values

# 3. Apply database migrations
# TODO: filled in during B2

# 4. Start the Next.js front-end
cd apps/web
# TODO: npm run dev (filled in during F1)

# 5. Start the AI engine
cd services/ai
# TODO: uvicorn main:app --reload (filled in during B3)

# 6. Start the simulator
cd services/simulator
# TODO: python main.py (filled in during B4)
```

## License

Private — All rights reserved.
