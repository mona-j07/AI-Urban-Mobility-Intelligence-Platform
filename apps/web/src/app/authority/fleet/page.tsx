"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicles } from "@/hooks/useVehicles";
import { useVehicleNames } from "@/hooks/useVehicleNames";
import { mockPositions } from "@/lib/mocks";

const TransportMap = dynamic(
  () => import("@/components/maps/TransportMap"),
  { ssr: false, loading: () => <Skeleton className="h-[500px] w-full rounded-lg" /> }
);

export default function FleetPage() {
  const { vehicles: live } = useVehicles();
  const vehicleNames = useVehicleNames();
  const vehicles = live.length > 0 ? live : mockPositions;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Fleet Map</h1>
        <p className="text-muted-foreground text-sm">
          All {vehicles.length} vehicles — live positions
        </p>
      </div>
      <div className="rounded-xl border overflow-hidden shadow-sm" style={{ height: 520 }}>
        <TransportMap vehicles={vehicles} vehicleNames={vehicleNames} />
      </div>
    </div>
  );
}
