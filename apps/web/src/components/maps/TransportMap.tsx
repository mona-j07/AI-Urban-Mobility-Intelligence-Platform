"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { VehiclePosition } from "@shared/types";
import { LiveStatusBadge } from "@/components/transport/LiveStatusBadge";
import { ETA } from "@/components/transport/ETA";
import { CrowdIndicator } from "@/components/transport/CrowdIndicator";

// Fix Leaflet default icon issue with bundlers
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const busIcon = L.divIcon({
  html: `<div style="background:#2563eb;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">B</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const metroIcon = L.divIcon({
  html: `<div style="background:#7c3aed;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">M</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Midpoint of SSN College Kalavakkam ↔ Marina Beach corridor
const DEFAULT_CENTER: [number, number] = [12.90, 80.23];
const DEFAULT_ZOOM = 12;

interface TransportMapProps {
  vehicles: VehiclePosition[];
  routeGeometry?: [number, number][];
  /** Map of vehicle_id → vehicle_number for human-readable popup labels */
  vehicleNames?: Map<string, string>;
}

export default function TransportMap({ vehicles, routeGeometry, vehicleNames }: TransportMapProps) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full rounded-lg"
      style={{ minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {vehicles.map((pos) => {
        const displayName = vehicleNames?.get(pos.vehicle_id) ?? pos.vehicle_id.slice(0, 12);
        return (
        <Marker
          key={pos.vehicle_id}
          position={[pos.latitude, pos.longitude]}
          icon={pos.route_id?.includes("0003") ? metroIcon : busIcon}
        >
          <Popup>
            <div className="space-y-2 min-w-[180px]">
              <div className="font-semibold text-sm">{displayName}</div>
              <LiveStatusBadge isSimulated={pos.is_simulated} />
              <div className="flex items-center gap-3 text-sm">
                <ETA minutes={pos.eta_minutes ?? undefined} />
                {pos.crowd_level && <CrowdIndicator level={pos.crowd_level} />}
              </div>
              {pos.speed != null && (
                <div className="text-xs text-gray-500">{pos.speed} km/h</div>
              )}
            </div>
          </Popup>
        </Marker>
        );
      })}

      {routeGeometry && routeGeometry.length > 1 && (
        <Polyline
          positions={routeGeometry}
          pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.8 }}
        />
      )}
    </MapContainer>
  );
}
