"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";
import { useHaptics } from "@/lib/useHaptics";

export function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();
  const { trigger } = useHaptics();

  const handleClick = () => {
    trigger("select");
    toggle();
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="relative flex h-8 w-8 items-center justify-center rounded-md text-content-muted transition-colors hover:bg-surface hover:text-content"
    >
      {/* Avoid a hydration flash: render nothing until mounted resolves theme */}
      {mounted && (
        <span className="animate-fade-in">
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </span>
      )}
    </button>
  );
}
