"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleCard } from "@/components/transport/VehicleCard";
import { LiveStatusBadge } from "@/components/transport/LiveStatusBadge";
import { useVehicles } from "@/hooks/useVehicles";
import { useVehicleNames } from "@/hooks/useVehicleNames";
import { getRouteDirections } from "@/lib/ors";
import { mockRoutes, mockVehicles as fallbackVehicles, mockPositions as fallbackPositions } from "@/lib/mocks";
import type { VehiclePosition } from "@shared/types";

// Dynamic import to avoid SSR issues with Leaflet (window is not defined)
const TransportMap = dynamic(
  () => import("@/components/maps/TransportMap"),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-lg" /> }
);

export default function TrackingPage() {
  const { vehicles: livePositions, loading, error } = useVehicles();
  const vehicleNames = useVehicleNames();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | undefined>();

  // Use live data if available, otherwise fall back to mocks
  const positions: VehiclePosition[] = livePositions.length > 0 ? livePositions : fallbackPositions;

  // Build a display-name map: vehicle_id → vehicle_number
  const vehicleNameMap = useMemo(() => {
    const map = new Map<string, string>();
    // Merge names from Supabase vehicles table
    for (const [id, name] of vehicleNames.entries()) {
      map.set(id, name);
    }
    // Fill in from fallback mock vehicles for any missing
    for (const v of fallbackVehicles) {
      if (!map.has(v.id)) {
        map.set(v.id, v.vehicle_number);
      }
    }
    return map;
  }, [vehicleNames]);

  // When a route is selected, fetch its road geometry
  useEffect(() => {
    if (!selectedRouteId) {
      setRouteGeometry(undefined);
      return;
    }

    // Use first and last stop coords for the selected route as endpoints
    const routePositions = positions.filter((p) => p.route_id === selectedRouteId);
    if (routePositions.length < 2) {
      // Fallback: draw between SSN College and Marina Beach
      getRouteDirections(12.7518, 80.1986, 13.0500, 80.2824).then((r) => {
        setRouteGeometry(r?.geometry);
      });
      return;
    }

    const first = routePositions[0];
    const last = routePositions[routePositions.length - 1];
    getRouteDirections(first.latitude, first.longitude, last.latitude, last.longitude).then((r) => {
      setRouteGeometry(r?.geometry);
    });
  }, [selectedRouteId, positions]);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live Tracking</h1>
        {loading && <Badge variant="secondary">Loading...</Badge>}
        {error && <Badge variant="secondary" className="text-amber-700 border-amber-300 bg-amber-50">{error}</Badge>}
      </div>

      {/* Route filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedRouteId === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRouteId(null)}
        >
          All Routes
        </Button>
        {mockRoutes.map((r) => (
          <Button
            key={r.id}
            variant={selectedRouteId === r.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRouteId(r.id)}
          >
            {r.route_number}
          </Button>
        ))}
      </div>

      {/* Map */}
      <Card className="overflow-hidden">
        <TransportMap
          vehicles={selectedRouteId ? positions.filter((p) => p.route_id === selectedRouteId) : positions}
          routeGeometry={routeGeometry}
          vehicleNames={vehicleNameMap}
        />
      </Card>

      {/* Vehicle list */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Vehicles {positions.length > 0 && `(${positions.length})`}
        </h2>
        {positions
          .filter((p) => !selectedRouteId || p.route_id === selectedRouteId)
          .map((pos) => {
            const vehicle = fallbackVehicles.find((v) => v.id === pos.vehicle_id) ?? {
              id: pos.vehicle_id,
              vehicle_number: vehicleNameMap.get(pos.vehicle_id) ?? pos.vehicle_id.slice(0, 12),
              route_id: pos.route_id,
              vehicle_type: "BUS" as const,
              status: "ON_ROUTE" as const,
              is_simulated: pos.is_simulated,
              created_at: null,
            };
            return (
              <div key={pos.vehicle_id} className="space-y-1">
                <LiveStatusBadge isSimulated={pos.is_simulated} />
                <VehicleCard vehicle={vehicle} position={pos} />
              </div>
            );
          })}

        {positions.length === 0 && !loading && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No vehicles currently broadcasting. Start the simulator (B3) to see live data.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
