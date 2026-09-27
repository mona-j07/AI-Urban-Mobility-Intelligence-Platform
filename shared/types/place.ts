export interface Place {
  id: string;
  name: string;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string | null;
  latitude: number | null;
  longitude: number | null;
}
