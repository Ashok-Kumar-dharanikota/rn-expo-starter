"use client";

import { useState } from "react";
import { BookText, Settings } from "lucide-react";
import { Logo } from "./ui/Logo";
import { SettingsModal } from "./SettingsModal";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight text-content">
              Expo Init <span className="text-accent">AI</span>
            </span>
          </div>

          <nav className="flex items-center gap-1">
            <a
              href="https://docs.expo.dev"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-content-muted transition-colors hover:bg-surface hover:text-content"
            >
              <BookText className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
            </a>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-content-muted transition-colors hover:bg-surface hover:text-content"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <span className="mx-1 h-5 w-px bg-line" aria-hidden />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
