import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Vehicle, VehiclePosition } from "@shared/types";
import { ETA } from "./ETA";
import { CrowdIndicator } from "./CrowdIndicator";

interface VehicleCardProps {
  vehicle: Vehicle;
  position?: VehiclePosition;
}

const statusColor: Record<string, string> = {
  ON_ROUTE: "bg-green-600",
  IDLE: "bg-yellow-500",
  OFFLINE: "bg-gray-400",
};

export function VehicleCard({ vehicle, position }: VehicleCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-mono">
            {vehicle.vehicle_number}
          </CardTitle>
          <Badge className={statusColor[vehicle.status ?? "OFFLINE"]}>
            {vehicle.status ?? "OFFLINE"}
          </Badge>
        </div>
        <CardDescription>
          {vehicle.vehicle_type ?? "BUS"} &middot; Route {vehicle.route_id?.slice(0, 8)}...
        </CardDescription>
      </CardHeader>
      {position && (
        <CardContent className="flex items-center gap-4 text-sm">
          {position.speed != null && (
            <span className="text-muted-foreground">
              {position.speed} km/h
            </span>
          )}
          <ETA minutes={position.eta_minutes ?? undefined} />
          {position.crowd_level && (
            <CrowdIndicator level={position.crowd_level} />
          )}
        </CardContent>
      )}
    </Card>
  );
}
