import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Route } from "@shared/types";
import { Bus, TrainFront } from "lucide-react";

interface RouteCardProps {
  route: Route;
}

export function RouteCard({ route }: RouteCardProps) {
  const Icon = route.route_type === "METRO" ? TrainFront : Bus;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Badge variant="default" className="text-lg px-3 py-1 shrink-0">
          {route.route_number}
        </Badge>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base truncate">{route.name}</CardTitle>
          <CardDescription className="flex items-center gap-1.5 mt-1">
            <Icon className="h-4 w-4" />
            {route.route_type ?? "BUS"}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
