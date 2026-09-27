export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string | null;
}

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}
