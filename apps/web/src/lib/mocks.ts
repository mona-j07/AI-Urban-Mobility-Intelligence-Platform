import type { Route, Vehicle, VehiclePosition, Stop } from "@shared/types";

export const mockRoutes: Route[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    route_number: "21G",
    name: "Tambaram - Thiruvanmiyur via OMR",
    route_type: "BUS",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    route_number: "23C",
    name: "Kelambakkam - Marina Beach",
    route_type: "BUS",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    route_number: "M1",
    name: "Chennai Airport - Washermanpet",
    route_type: "METRO",
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: "c1b2c3d4-0001-4000-8000-000000000001",
    vehicle_number: "TN-01-AB-1234",
    route_id: "a1b2c3d4-0001-4000-8000-000000000001",
    vehicle_type: "BUS",
    status: "ON_ROUTE",
    is_simulated: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "c1b2c3d4-0002-4000-8000-000000000002",
    vehicle_number: "TN-01-CD-5678",
    route_id: "a1b2c3d4-0002-4000-8000-000000000002",
    vehicle_type: "BUS",
    status: "IDLE",
    is_simulated: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "c1b2c3d4-0003-4000-8000-000000000003",
    vehicle_number: "METRO-M1-001",
    route_id: "a1b2c3d4-0003-4000-8000-000000000003",
    vehicle_type: "METRO",
    status: "ON_ROUTE",
    is_simulated: false,
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const mockPositions: VehiclePosition[] = [
  {
    id: "d1b2c3d4-0001-4000-8000-000000000001",
    vehicle_id: "c1b2c3d4-0001-4000-8000-000000000001",
    route_id: "a1b2c3d4-0001-4000-8000-000000000001",
    latitude: 12.8996,
    longitude: 80.2209,
    speed: 28,
    next_stop_id: "b1b2c3d4-0005-4000-8000-000000000005",
    eta_minutes: 6,
    crowd_level: "MEDIUM",
    is_simulated: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "d1b2c3d4-0002-4000-8000-000000000002",
    vehicle_id: "c1b2c3d4-0002-4000-8000-000000000002",
    route_id: "a1b2c3d4-0002-4000-8000-000000000002",
    latitude: 12.8305,
    longitude: 80.2107,
    speed: 0,
    next_stop_id: null,
    eta_minutes: null,
    crowd_level: "LOW",
    is_simulated: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "d1b2c3d4-0003-4000-8000-000000000003",
    vehicle_id: "c1b2c3d4-0003-4000-8000-000000000003",
    route_id: "a1b2c3d4-0003-4000-8000-000000000003",
    latitude: 13.0006,
    longitude: 80.1758,
    speed: 65,
    next_stop_id: "b1b2c3d4-0009-4000-8000-000000000009",
    eta_minutes: 3,
    crowd_level: "HIGH",
    is_simulated: false,
    updated_at: new Date().toISOString(),
  },
];

export const mockStops: Stop[] = [
  { id: "b1b2c3d4-0001-4000-8000-000000000001", name: "Tambaram Railway Station", latitude: 12.9249, longitude: 80.1000, created_at: null },
  { id: "b1b2c3d4-0002-4000-8000-000000000002", name: "Perungalathur", latitude: 12.9070, longitude: 80.0943, created_at: null },
  { id: "b1b2c3d4-0003-4000-8000-000000000003", name: "Vandalur", latitude: 12.8923, longitude: 80.0816, created_at: null },
  { id: "b1b2c3d4-0004-4000-8000-000000000004", name: "Urapakkam", latitude: 12.8736, longitude: 80.0697, created_at: null },
  { id: "b1b2c3d4-0005-4000-8000-000000000005", name: "Sholinganallur Junction", latitude: 12.8996, longitude: 80.2209, created_at: null },
  { id: "b1b2c3d4-0006-4000-8000-000000000006", name: "Thiruvanmiyur", latitude: 12.9823, longitude: 80.2641, created_at: null },
];
