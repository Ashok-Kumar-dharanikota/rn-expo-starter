"use client";

import { useCallback, useEffect, useState } from "react";

export type HapticPattern =
  | "light"
  | "medium"
  | "heavy"
  | "select"
  | "success"
  | "error";

const STORAGE_KEY = "expo-init-ai:haptics";

/** Vibration Web API patterns (ms). No-ops on unsupported devices. */
const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 8,
  medium: 14,
  heavy: 22,
  select: 6,
  success: [10, 30, 14],
  error: [24, 40, 24],
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Haptic feedback as an accessibility enhancement. Users can opt out;
 * reduced-motion is always respected. Safe to call anywhere.
 */
export function useHaptics() {
  const [enabled, setEnabledState] = useState(true);
  const supported =
    typeof navigator !== "undefined" && "vibrate" in navigator;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setEnabledState(stored === "true");
    } catch {
      /* ignore */
    }
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const trigger = useCallback(
    (pattern: HapticPattern = "light") => {
      if (!enabled || prefersReducedMotion()) return;
      if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
      try {
        navigator.vibrate(PATTERNS[pattern]);
      } catch {
        /* ignore */
      }
    },
    [enabled],
  );

  return { trigger, enabled, setEnabled, supported };
}
