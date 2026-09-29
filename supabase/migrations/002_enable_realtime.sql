-- ============================================================
-- 002_enable_realtime.sql
-- Enable Supabase Realtime on vehicle_positions so the
-- useVehicles() hook receives live INSERT events.
-- ============================================================

-- Add the table to the default supabase_realtime publication.
-- Supabase creates this publication automatically; we just need
-- to add our table to it.
ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_positions;
