export type CrowdLevel = "LOW" | "MEDIUM" | "HIGH";

export interface CrowdReport {
  id: string;
  vehicle_id: string | null;
  crowd_level: CrowdLevel | null;
  reported_at: string | null;
}

export interface CrowdPrediction {
  id: string;
  route_id: string | null;
  stop_id: string | null;
  prediction_time: string;
  predicted_occupancy: number | null;
  crowd_level: CrowdLevel | null;
  confidence: number | null;
  created_at: string | null;
}

export interface DemandPrediction {
  id: string;
  route_id: string | null;
  prediction_time: string;
  predicted_demand: number | null;
  created_at: string | null;
}
