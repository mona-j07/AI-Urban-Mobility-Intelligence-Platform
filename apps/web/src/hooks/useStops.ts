"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Stop } from "@shared/types";
import { mockStops } from "@/lib/mocks";

/**
 * Fetches stops from Supabase on mount.
 * Falls back to mockStops if the query fails.
 */
export function useStops(): Stop[] {
  const [stops, setStops] = useState<Stop[]>(mockStops);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    async function fetchStops() {
      const { data, error } = await supabaseRef.current
        .from("stops")
        .select("*")
        .order("name");

      if (!error && data && data.length > 0) {
        setStops(data as Stop[]);
      }
    }
    fetchStops();
  }, []);

  return stops;
}
