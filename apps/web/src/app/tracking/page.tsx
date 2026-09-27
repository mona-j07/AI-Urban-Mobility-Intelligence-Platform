import { Card, CardContent } from "@/components/ui/card";
import { VehicleCard } from "@/components/transport/VehicleCard";
import { LiveStatusBadge } from "@/components/transport/LiveStatusBadge";
import { TransportTimeline } from "@/components/transport/TransportTimeline";
import { mockVehicles, mockPositions, mockStops } from "@/lib/mocks";

export default function TrackingPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Live Tracking</h1>

      <Card className="border-dashed">
        <CardContent className="py-12 text-center text-muted-foreground">
          Live map coming in F5
        </CardContent>
      </Card>

      <div className="space-y-4">
        {mockVehicles.map((vehicle, i) => {
          const position = mockPositions.find((p) => p.vehicle_id === vehicle.id);
          return (
            <div key={vehicle.id} className="space-y-2">
              <LiveStatusBadge isSimulated={vehicle.is_simulated} />
              <VehicleCard vehicle={vehicle} position={position} />
            </div>
          );
        })}
      </div>

      {/* Sample timeline */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Route 21G Stops</h2>
        <Card>
          <CardContent className="py-4">
            <TransportTimeline stops={mockStops} currentStopIndex={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
