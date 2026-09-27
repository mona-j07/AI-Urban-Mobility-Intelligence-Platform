/**
 * OpenRouteService client-side directions helper.
 * Fetches route geometry for drawing polylines on the map.
 * Caches results in-memory to conserve the 2,000/day free quota.
 */

interface DirectionsResult {
  geometry: [number, number][]; // [lat, lng] pairs
  distance_km: number;
  duration_minutes: number;
}

const cache = new Map<string, DirectionsResult>();

function cacheKey(
  oLat: number, oLng: number, dLat: number, dLng: number
): string {
  return [oLat, oLng, dLat, dLng].map((v) => v.toFixed(4)).join(",");
}

export async function getRouteDirections(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<DirectionsResult | null> {
  const key = cacheKey(originLat, originLng, destLat, destLng);

  // Return cached result if available
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  if (!apiKey) {
    console.warn("[ORS] NEXT_PUBLIC_MAP_API_KEY not set");
    return null;
  }

  try {
    const resp = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [
            [originLng, originLat], // ORS uses [lng, lat]
            [destLng, destLat],
          ],
        }),
      }
    );

    if (!resp.ok) {
      console.warn(`[ORS] ${resp.status}: ${await resp.text().then(t => t.slice(0, 200))}`);
      return null;
    }

    const data = await resp.json();
    const route = data.routes[0];
    const summary = route.summary;

    // Decode the encoded polyline geometry
    const encodedGeometry = route.geometry;
    const geometry = decodePolyline(encodedGeometry);

    const result: DirectionsResult = {
      geometry,
      distance_km: Math.round((summary.distance / 1000) * 100) / 100,
      duration_minutes: Math.round((summary.duration / 60) * 10) / 10,
    };

    cache.set(key, result);
    return result;
  } catch (e) {
    console.warn("[ORS] Directions failed:", e);
    return null;
  }
}

/**
 * Decode an encoded polyline string into [lat, lng] pairs.
 * Uses the Google encoded polyline algorithm.
 */
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}
