# Architecture

The AI Urban Mobility Intelligence Platform is composed of four independently-runnable layers:

1. **Next.js PWA** (`apps/web/`) — A Next.js 14 App Router front-end (TypeScript, Tailwind CSS, shadcn/ui) that serves as the user-facing dashboard. It provides real-time traffic visualisation on an interactive map, route planning with AI-powered suggestions, and administrative controls for the simulation. It communicates with Supabase for data and auth, and with the FastAPI AI engine for intelligent analysis.

2. **Supabase** (`supabase/`) — A managed Postgres database with Row-Level Security, Supabase Auth for user authentication, and Supabase Realtime for streaming live vehicle and sensor updates to the front-end. Migrations and seed data live in this directory.

3. **FastAPI AI Engine** (`services/ai/`) — A Python FastAPI service that hosts the AI/ML layer. It receives requests from the front-end, queries Supabase for context, calls the Anthropic API for natural-language analysis, and integrates with OpenRouteService for geocoding and routing. It exposes REST endpoints consumed by the Next.js app.

4. **Python Simulator** (`services/simulator/`) — A standalone Python process that generates realistic urban-mobility data (vehicles, sensors, traffic events) and writes it directly to Supabase via the service-role key. The front-end picks up these changes in real time through Supabase Realtime subscriptions.
