import type { CrowdLevel } from "./crowd";

export type VehicleType = "BUS" | "METRO";
export type VehicleStatus = "ON_ROUTE" | "IDLE" | "OFFLINE";

export interface Vehicle {
  id: string;
  vehicle_number: string;
  route_id: string | null;
  vehicle_type: VehicleType | null;
  status: VehicleStatus | null;
  is_simulated: boolean;
  created_at: string | null;
}

export interface VehiclePosition {
  id: string;
  vehicle_id: string;
  route_id: string | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  next_stop_id: string | null;
  eta_minutes: number | null;
  crowd_level: CrowdLevel | null;
  is_simulated: boolean;
  updated_at: string;
}
