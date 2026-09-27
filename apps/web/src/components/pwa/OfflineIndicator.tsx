"use client";

import { usePWA } from "@/hooks/usePWA";

/**
 * Fixed banner shown at the top of the screen when the user is offline.
 * Renders nothing when online.
 */
export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
    >
      <span aria-hidden="true">&#128225;</span>
      <span>No internet — showing cached data where available</span>
    </div>
  );
}
