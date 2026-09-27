export type RouteType = "BUS" | "METRO";

export interface Route {
  id: string;
  route_number: string;
  name: string | null;
  route_type: RouteType | null;
  created_at: string | null;
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_id: string;
  sequence_number: number;
}
