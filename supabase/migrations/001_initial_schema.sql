-- ============================================================
-- 001_initial_schema.sql
-- AI Urban Mobility Intelligence Platform — initial schema
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. TABLES
-- ────────────────────────────────────────────────────────────

-- Users (linked to Supabase Auth)
CREATE TABLE users (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid() REFERENCES auth.users(id),
  full_name  text,
  role       text        CHECK (role IN ('passenger', 'authority')) DEFAULT 'passenger',
  created_at timestamptz DEFAULT now()
);

-- Transit routes
CREATE TABLE routes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_number text NOT NULL,
  name         text,
  route_type   text CHECK (route_type IN ('BUS', 'METRO')),
  created_at   timestamptz DEFAULT now()
);

-- Bus / metro stops
CREATE TABLE stops (
  id         uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text             NOT NULL,
  latitude   double precision NOT NULL,
  longitude  double precision NOT NULL,
  created_at timestamptz      DEFAULT now()
);

-- Metro / rail stations
CREATE TABLE stations (
  id        uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  name      text             NOT NULL,
  latitude  double precision NOT NULL,
  longitude double precision NOT NULL
);

-- Ordered join table: which stops belong to which route
CREATE TABLE route_stops (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id        uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  stop_id         uuid NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  sequence_number int  NOT NULL
);

-- Vehicles (buses and metro cars)
CREATE TABLE vehicles (
  id             uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number text    UNIQUE NOT NULL,
  route_id       uuid    REFERENCES routes(id),
  vehicle_type   text    CHECK (vehicle_type IN ('BUS', 'METRO')),
  status         text    CHECK (status IN ('ON_ROUTE', 'IDLE', 'OFFLINE')) DEFAULT 'IDLE',
  is_simulated   boolean NOT NULL DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

-- Append-only live telemetry for each vehicle
CREATE TABLE vehicle_positions (
  id           uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id   uuid             NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  route_id     uuid             REFERENCES routes(id),
  latitude     double precision NOT NULL,
  longitude    double precision NOT NULL,
  speed        numeric,
  next_stop_id uuid             REFERENCES stops(id),
  eta_minutes  int,
  crowd_level  text             CHECK (crowd_level IN ('LOW', 'MEDIUM', 'HIGH')),
  is_simulated boolean          NOT NULL DEFAULT true,
  updated_at   timestamptz      NOT NULL DEFAULT now()
);

-- Scheduled arrival times per route/stop
CREATE TABLE schedules (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id     uuid REFERENCES routes(id),
  stop_id      uuid REFERENCES stops(id),
  arrival_time time NOT NULL,
  day_type     text CHECK (day_type IN ('WEEKDAY', 'WEEKEND')) DEFAULT 'WEEKDAY'
);

-- User-submitted crowd reports
CREATE TABLE crowd_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id  uuid        REFERENCES vehicles(id),
  crowd_level text        CHECK (crowd_level IN ('LOW', 'MEDIUM', 'HIGH')),
  reported_at timestamptz DEFAULT now()
);

-- AI-generated crowd predictions
CREATE TABLE crowd_predictions (
  id                  uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id            uuid    REFERENCES routes(id),
  stop_id             uuid    REFERENCES stops(id),
  prediction_time     timestamptz NOT NULL,
  predicted_occupancy numeric,
  crowd_level         text    CHECK (crowd_level IN ('LOW', 'MEDIUM', 'HIGH')),
  confidence          numeric CHECK (confidence BETWEEN 0 AND 1),
  created_at          timestamptz DEFAULT now()
);

-- AI-generated demand predictions
CREATE TABLE demand_predictions (
  id               uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id         uuid    REFERENCES routes(id),
  prediction_time  timestamptz NOT NULL,
  predicted_demand numeric,
  created_at       timestamptz DEFAULT now()
);

-- Points of interest
CREATE TABLE places (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name      text NOT NULL,
  category  text,
  latitude  double precision,
  longitude double precision
);

-- Restaurants near transit
CREATE TABLE restaurants (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name      text NOT NULL,
  cuisine   text,
  latitude  double precision,
  longitude double precision
);

-- User trip plans
CREATE TABLE trips (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES users(id),
  origin_stop_id      uuid REFERENCES stops(id),
  destination_stop_id uuid REFERENCES stops(id),
  departure_time      timestamptz,
  created_at          timestamptz DEFAULT now()
);

-- Options generated for each trip
CREATE TABLE trip_options (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id          uuid REFERENCES trips(id) ON DELETE CASCADE,
  label            text CHECK (label IN ('FASTEST', 'CHEAPEST', 'LEAST_CROWDED')),
  duration_minutes int,
  fare             numeric,
  crowd_level      text CHECK (crowd_level IN ('LOW', 'MEDIUM', 'HIGH'))
);

-- Digital tickets
CREATE TABLE tickets (
  id        uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid    REFERENCES users(id),
  route_id  uuid    REFERENCES routes(id),
  fare      numeric,
  is_used   boolean     DEFAULT false,
  issued_at timestamptz DEFAULT now(),
  used_at   timestamptz
);


-- ────────────────────────────────────────────────────────────
-- 2. INDEXES
-- ────────────────────────────────────────────────────────────

CREATE INDEX idx_vehicle_positions_vehicle_time
  ON vehicle_positions (vehicle_id, updated_at DESC);

CREATE INDEX idx_crowd_predictions_route_time
  ON crowd_predictions (route_id, prediction_time);


-- ────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

-- Enable RLS on every table
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops              ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_positions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules          ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_reports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_predictions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE places             ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants        ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips              ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_options       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets            ENABLE ROW LEVEL SECURITY;

-- ── 3a. Public-read policies (anon + authenticated SELECT) ──

CREATE POLICY "public read routes"
  ON routes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read stops"
  ON stops FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read stations"
  ON stations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read route_stops"
  ON route_stops FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read vehicles"
  ON vehicles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read vehicle_positions"
  ON vehicle_positions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read schedules"
  ON schedules FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read crowd_predictions"
  ON crowd_predictions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read demand_predictions"
  ON demand_predictions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read places"
  ON places FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public read restaurants"
  ON restaurants FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── 3b. Service-role write policies ─────────────────────────
-- (service_role bypasses RLS by default, but explicit policies
--  ensure the intent is documented and testable)

CREATE POLICY "service write vehicle_positions"
  ON vehicle_positions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service write crowd_reports"
  ON crowd_reports FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service write crowd_predictions"
  ON crowd_predictions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service write demand_predictions"
  ON demand_predictions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service write tickets"
  ON tickets FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── 3c. User-owned row policies ─────────────────────────────

-- users: each user can read/update only their own profile
CREATE POLICY "users select own"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users insert own"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users update own"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- trips: users can only see/create/update their own trips
CREATE POLICY "trips select own"
  ON trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "trips insert own"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trips update own"
  ON trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- trip_options: visible if the user owns the parent trip
CREATE POLICY "trip_options select own"
  ON trip_options FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_options.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "trip_options insert own"
  ON trip_options FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_options.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "trip_options update own"
  ON trip_options FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_options.trip_id
        AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_options.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- tickets: users can read their own tickets
CREATE POLICY "tickets select own"
  ON tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "tickets insert own"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
