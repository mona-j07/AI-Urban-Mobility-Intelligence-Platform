"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MapPin, Navigation } from "lucide-react";
import { ItineraryCard } from "@/components/planner/ItineraryCard";
import { useStops } from "@/hooks/useStops";

const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL ?? "http://localhost:8000";

interface PlanResult {
  origin: { name: string };
  destination: { name: string };
  options: Array<{
    label: string;
    duration_minutes: number;
    fare: number;
    crowd_level: string;
    description?: string;
    data_source: string;
  }>;
}

export default function PlannerPage() {
  const stops = useStops();
  const [originId, setOriginId] = useState("");
  const [destId, setDestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEstimated = result?.options.some((o) => o.data_source === "estimated");

  async function handlePlan() {
    if (!originId || !destId) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${AI_ENGINE_URL}/itinerary/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin_stop_id: originId,
          destination_stop_id: destId,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail ?? `HTTP ${res.status}`);
      }

      setResult(await res.json());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(
        msg.includes("fetch") || msg.includes("Failed")
          ? "Couldn't reach the AI engine — is it running on port 8000? Start it with: uvicorn app.main:app --reload"
          : msg
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Trip Planner</h1>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan your journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Origin select */}
          <div className="space-y-1.5">
            <label
              htmlFor="planner-origin"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <Navigation className="h-3.5 w-3.5 text-primary" />
              From
            </label>
            <select
              id="planner-origin"
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select origin stop…</option>
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination select */}
          <div className="space-y-1.5">
            <label
              htmlFor="planner-dest"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              To
            </label>
            <select
              id="planner-dest"
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select destination stop…</option>
              {stops
                .filter((s) => s.id !== originId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          <Button
            id="planner-plan-btn"
            onClick={handlePlan}
            disabled={!originId || !destId || loading}
            className="w-full"
          >
            {loading ? "Planning…" : "Plan Trip"}
          </Button>
        </CardContent>
      </Card>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Navigation className="h-3.5 w-3.5" />
            <span>
              {result.origin.name} → {result.destination.name}
            </span>
          </div>

          <div className="space-y-3">
            {result.options.map((opt, i) => (
              <ItineraryCard key={i} option={opt} />
            ))}
          </div>

          {/* Estimated data note */}
          {isEstimated && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />
              Travel times are estimated — live routing temporarily unavailable.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
