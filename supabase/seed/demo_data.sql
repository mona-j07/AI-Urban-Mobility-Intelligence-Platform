-- Demo dataset only. Not real MTC data.
-- Seeds the database with sample routes, stops, vehicles, schedules,
-- and predictions for development and testing purposes.
-- Coordinates are in the SSN College Kalavakkam → Marina Beach corridor (Chennai).

-- ────────────────────────────────────────────────────────────
-- ROUTES
-- ────────────────────────────────────────────────────────────

INSERT INTO routes (id, route_number, name, route_type) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', '21G',  'Tambaram – Thiruvanmiyur (OMR)', 'BUS'),
  ('a1b2c3d4-0002-4000-8000-000000000002', '23C',  'Kelambakkam – Marina Beach',     'BUS'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'M1',   'Chennai Airport – Washermanpet', 'METRO');

-- ────────────────────────────────────────────────────────────
-- STOPS  (SSN Kalavakkam ↔ Marina Beach corridor, Chennai)
-- ────────────────────────────────────────────────────────────

INSERT INTO stops (id, name, latitude, longitude) VALUES
  ('b1b2c3d4-0001-4000-8000-000000000001', 'SSN College, Kalavakkam',    12.7518, 80.1986),
  ('b1b2c3d4-0002-4000-8000-000000000002', 'Kalavakkam Junction',        12.7620, 80.2105),
  ('b1b2c3d4-0003-4000-8000-000000000003', 'Kelambakkam',                12.7860, 80.2190),
  ('b1b2c3d4-0004-4000-8000-000000000004', 'Navalur',                    12.8450, 80.2270),
  ('b1b2c3d4-0005-4000-8000-000000000005', 'Sholinganallur Junction',    12.8920, 80.2270),
  ('b1b2c3d4-0006-4000-8000-000000000006', 'Perungudi',                  12.9610, 80.2430),
  ('b1b2c3d4-0007-4000-8000-000000000007', 'Adyar Signal',               13.0060, 80.2570),
  ('b1b2c3d4-0008-4000-8000-000000000008', 'Mylapore Tank',              13.0340, 80.2690),
  ('b1b2c3d4-0009-4000-8000-000000000009', 'Marina Beach',               13.0500, 80.2824),
  ('b1b2c3d4-0010-4000-8000-000000000010', 'Guindy (Metro)',             12.9516, 80.2130);

-- ────────────────────────────────────────────────────────────
-- ROUTE_STOPS  (ordered stop sequences per route)
-- ────────────────────────────────────────────────────────────

-- Route 21G: SSN → Kalavakkam Jn → Kelambakkam → Sholinganallur → Perungudi
INSERT INTO route_stops (route_id, stop_id, sequence_number) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 1),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0002-4000-8000-000000000002', 2),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0003-4000-8000-000000000003', 3),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0005-4000-8000-000000000005', 4),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0006-4000-8000-000000000006', 5);

-- Route 23C: Kelambakkam → Navalur → Sholinganallur → Adyar → Marina Beach
INSERT INTO route_stops (route_id, stop_id, sequence_number) VALUES
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0003-4000-8000-000000000003', 1),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0004-4000-8000-000000000004', 2),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0005-4000-8000-000000000005', 3),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0007-4000-8000-000000000007', 4),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0009-4000-8000-000000000009', 5);

-- Route M1 (Metro): Guindy → Perungudi → Mylapore
INSERT INTO route_stops (route_id, stop_id, sequence_number) VALUES
  ('a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0010-4000-8000-000000000010', 1),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0006-4000-8000-000000000006', 2),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0008-4000-8000-000000000008', 3);

-- ────────────────────────────────────────────────────────────
-- VEHICLES  (5 vehicles across the 3 routes)
-- ────────────────────────────────────────────────────────────

INSERT INTO vehicles (id, vehicle_number, route_id, vehicle_type, status, is_simulated) VALUES
  ('c1b2c3d4-0001-4000-8000-000000000001', 'TN-01-AB-1234', 'a1b2c3d4-0001-4000-8000-000000000001', 'BUS',   'ON_ROUTE', true),
  ('c1b2c3d4-0002-4000-8000-000000000002', 'TN-01-CD-5678', 'a1b2c3d4-0001-4000-8000-000000000001', 'BUS',   'IDLE',     true),
  ('c1b2c3d4-0003-4000-8000-000000000003', 'TN-01-EF-9012', 'a1b2c3d4-0002-4000-8000-000000000002', 'BUS',   'ON_ROUTE', true),
  ('c1b2c3d4-0004-4000-8000-000000000004', 'TN-01-GH-3456', 'a1b2c3d4-0002-4000-8000-000000000002', 'BUS',   'ON_ROUTE', true),
  ('c1b2c3d4-0005-4000-8000-000000000005', 'METRO-M1-001',  'a1b2c3d4-0003-4000-8000-000000000003', 'METRO', 'ON_ROUTE', true);

-- ────────────────────────────────────────────────────────────
-- SCHEDULES  (weekday arrival times for each route/stop pair)
-- ────────────────────────────────────────────────────────────

-- Route 21G schedules
INSERT INTO schedules (route_id, stop_id, arrival_time, day_type) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', '07:00', 'WEEKDAY'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0002-4000-8000-000000000002', '07:12', 'WEEKDAY'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0003-4000-8000-000000000003', '07:25', 'WEEKDAY'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0005-4000-8000-000000000005', '07:45', 'WEEKDAY'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0006-4000-8000-000000000006', '08:05', 'WEEKDAY');

-- Route 23C schedules
INSERT INTO schedules (route_id, stop_id, arrival_time, day_type) VALUES
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0003-4000-8000-000000000003', '06:30', 'WEEKDAY'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0004-4000-8000-000000000004', '06:50', 'WEEKDAY'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0005-4000-8000-000000000005', '07:05', 'WEEKDAY'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0007-4000-8000-000000000007', '07:30', 'WEEKDAY'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0009-4000-8000-000000000009', '07:55', 'WEEKDAY');

-- Route M1 schedules
INSERT INTO schedules (route_id, stop_id, arrival_time, day_type) VALUES
  ('a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0010-4000-8000-000000000010', '08:00', 'WEEKDAY'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0006-4000-8000-000000000006', '08:12', 'WEEKDAY'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0008-4000-8000-000000000008', '08:22', 'WEEKDAY');

-- ────────────────────────────────────────────────────────────
-- CROWD PREDICTIONS  (2 sample rows)
-- ────────────────────────────────────────────────────────────

INSERT INTO crowd_predictions (route_id, stop_id, prediction_time, predicted_occupancy, crowd_level, confidence) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0005-4000-8000-000000000005',
   now() + interval '30 minutes', 72, 'HIGH', 0.85),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0009-4000-8000-000000000009',
   now() + interval '1 hour', 35, 'LOW', 0.91);

-- ────────────────────────────────────────────────────────────
-- DEMAND PREDICTIONS  (1 sample row)
-- ────────────────────────────────────────────────────────────

INSERT INTO demand_predictions (route_id, prediction_time, predicted_demand) VALUES
  ('a1b2c3d4-0002-4000-8000-000000000002', now() + interval '2 hours', 142);
