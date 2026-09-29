"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Fetches the vehicles table once on mount and returns a Map of
 * vehicle_id → vehicle_number for human-readable display in map
 * popups and vehicle cards.
 */
export function useVehicleNames(): Map<string, string> {
  const [names, setNames] = useState<Map<string, string>>(new Map());
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    async function fetch() {
      const { data } = await supabaseRef.current
        .from("vehicles")
        .select("id, vehicle_number");

      if (data) {
        const map = new Map<string, string>();
        for (const row of data) {
          map.set(row.id, row.vehicle_number);
        }
        setNames(map);
      }
    }

    fetch();
  }, []);

  return names;
}
