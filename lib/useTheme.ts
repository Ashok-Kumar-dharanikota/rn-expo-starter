"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "expo-init-ai:theme";

/** Applies the theme class + persists the choice. Dark is the default. */
function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: Theme = "dark";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        initial = "light";
      }
    } catch {
      /* ignore */
    }
    setThemeState(initial);
    apply(initial);
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    apply(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      apply(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { theme, setTheme, toggle, mounted };
}

/** Inline script string that sets the theme class before paint (no FOUC). */
export const themeInitScript = `
(function(){
  try {
    var k = '${STORAGE_KEY}';
    var s = localStorage.getItem(k);
    var t = (s === 'light' || s === 'dark')
      ? s
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var r = document.documentElement;
    if (t === 'dark') r.classList.add('dark');
    r.style.colorScheme = t;
  } catch (e) {}
})();
`;
