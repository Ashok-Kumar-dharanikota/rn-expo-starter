"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "expo-init-ai:openai-key";

/**
 * Persists the user's OpenAI API key in localStorage.
 * The key never leaves the browser — generation is mocked client-side,
 * so this simply demonstrates a real settings surface.
 */
export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setApiKeyState(stored);
    } catch {
      /* localStorage unavailable — degrade silently */
    } finally {
      setHydrated(true);
    }
  }, []);

  const setApiKey = useCallback((value: string) => {
    setApiKeyState(value);
    try {
      if (value) {
        window.localStorage.setItem(STORAGE_KEY, value);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore write failures */
    }
  }, []);

  const clearApiKey = useCallback(() => setApiKey(""), [setApiKey]);

  return { apiKey, setApiKey, clearApiKey, hydrated, hasKey: apiKey.length > 0 };
}
