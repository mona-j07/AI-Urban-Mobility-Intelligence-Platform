import type { CrowdLevel } from "./crowd";

export type TripOptionLabel = "FASTEST" | "CHEAPEST" | "LEAST_CROWDED";

export interface Trip {
  id: string;
  user_id: string | null;
  origin_stop_id: string | null;
  destination_stop_id: string | null;
  departure_time: string | null;
  created_at: string | null;
}

export interface TripOption {
  id: string;
  trip_id: string | null;
  label: TripOptionLabel | null;
  duration_minutes: number | null;
  fare: number | null;
  crowd_level: CrowdLevel | null;
}
