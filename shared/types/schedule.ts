export type DayType = "WEEKDAY" | "WEEKEND";

export interface Schedule {
  id: string;
  route_id: string | null;
  stop_id: string | null;
  arrival_time: string;
  day_type: DayType | null;
}
