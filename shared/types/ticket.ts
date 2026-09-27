export interface Ticket {
  id: string;
  user_id: string | null;
  route_id: string | null;
  fare: number | null;
  is_used: boolean | null;
  issued_at: string | null;
  used_at: string | null;
}
