"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VehiclePosition } from "@shared/types";

interface UseVehiclesReturn {
  vehicles: VehiclePosition[];
  loading: boolean;
  error: string | null;
}

export function useVehicles(): UseVehiclesReturn {
  const [vehicleMap, setVehicleMap] = useState<Map<string, VehiclePosition>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;

    // 1. Fetch the latest position per vehicle
    async function fetchLatest() {
      try {
        const { data, error: fetchErr } = await supabase
          .from("vehicle_positions")
          .select("*")
          .order("updated_at", { ascending: false });

        if (fetchErr) {
          console.warn("[useVehicles] Fetch error:", fetchErr.message);
          setError("Live vehicle data unavailable — using simulated data");
          setLoading(false);
          return;
        }

        // Keep only the latest per vehicle_id
        const map = new Map<string, VehiclePosition>();
        for (const row of data ?? []) {
          if (!map.has(row.vehicle_id)) {
            map.set(row.vehicle_id, row as VehiclePosition);
          }
        }
        setVehicleMap(map);
        setError(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to fetch vehicles");
      } finally {
        setLoading(false);
      }
    }

    fetchLatest();

    // 2. Subscribe to realtime inserts
    const channel = supabase
      .channel("vehicle-positions")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "vehicle_positions",
        },
        (payload) => {
          const pos = payload.new as VehiclePosition;
          setVehicleMap((prev) => {
            const next = new Map(prev);
            next.set(pos.vehicle_id, pos);
            return next;
          });
        }
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR") {
          // Realtime subscription failed (e.g. table not in publication).
          // Log it but don't block the UI — the initial REST fetch still works.
          console.warn("[useVehicles] Realtime subscription error:", err?.message ?? status);
        }
      });

    // 3. Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    vehicles: Array.from(vehicleMap.values()),
    loading,
    error,
  };
}
