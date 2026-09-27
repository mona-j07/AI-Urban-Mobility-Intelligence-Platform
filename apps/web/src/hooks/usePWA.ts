"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface UsePWAReturn {
  /** Whether the browser currently has an internet connection */
  isOnline: boolean;
  /** Whether the app can be installed (A2HS prompt available) */
  isInstallable: boolean;
  /** Trigger the install prompt (no-op if not installable) */
  promptInstall: () => Promise<void>;
}

/**
 * PWA utilities hook.
 * Tracks online/offline status and the Add-to-Home-Screen install prompt.
 */
export function usePWA(): UsePWAReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Set initial state from navigator
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Capture the install prompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  return {
    isOnline,
    isInstallable: installPrompt !== null,
    promptInstall,
  };
}
