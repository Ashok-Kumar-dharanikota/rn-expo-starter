"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Moon,
  Sun,
  Trash2,
  Vibrate,
  X,
} from "lucide-react";
import { useApiKey } from "@/lib/useApiKey";
import { useHaptics } from "@/lib/useHaptics";
import { useTheme } from "@/lib/useTheme";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const { enabled: haptics, setEnabled: setHaptics, supported, trigger } =
    useHaptics();
  const { theme, setTheme } = useTheme();

  const [draft, setDraft] = useState("");
  const [reveal, setReveal] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDraft(apiKey);
      setSaved(false);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open, apiKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    setApiKey(draft.trim());
    trigger("success");
    setSaved(true);
    setTimeout(onClose, 550);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="absolute inset-0 bg-canvas/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md animate-scale-in rounded-lg border border-line bg-surface shadow-panel">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="settings-title" className="text-sm font-medium text-content">
            Settings
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-md p-1 text-content-subtle transition-colors hover:bg-surface-raised hover:text-content"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-5 py-5">
          {/* Appearance */}
          <section>
            <SectionLabel>Appearance</SectionLabel>
            <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-md border border-line bg-canvas-raised p-1">
              <SegButton
                active={theme === "light"}
                onClick={() => {
                  trigger("select");
                  setTheme("light");
                }}
                icon={<Sun className="h-3.5 w-3.5" />}
                label="Light"
              />
              <SegButton
                active={theme === "dark"}
                onClick={() => {
                  trigger("select");
                  setTheme("dark");
                }}
                icon={<Moon className="h-3.5 w-3.5" />}
                label="Dark"
              />
            </div>
          </section>

          {/* Haptics */}
          <section>
            <SectionLabel>Accessibility</SectionLabel>
            <button
              onClick={() => {
                const next = !haptics;
                setHaptics(next);
                if (next) trigger("medium");
              }}
              role="switch"
              aria-checked={haptics}
              className="mt-2 flex w-full items-center justify-between rounded-md border border-line bg-canvas-raised px-3 py-2.5 text-left transition-colors hover:border-line-strong"
            >
              <span className="flex items-center gap-2.5">
                <Vibrate className="h-4 w-4 text-content-subtle" />
                <span>
                  <span className="block text-[13px] text-content">
                    Haptic feedback
                  </span>
                  <span className="block text-[12px] text-content-subtle">
                    {supported
                      ? "Subtle vibration on key actions"
                      : "Not supported on this device"}
                  </span>
                </span>
              </span>
              <Switch on={haptics} />
            </button>
          </section>

          {/* API key */}
          <section>
            <SectionLabel>
              <KeyRound className="mr-1.5 inline h-3 w-3" />
              OpenAI API key
            </SectionLabel>
            <p className="mb-2.5 mt-1 text-[12.5px] leading-relaxed text-content-muted">
              Stored only in this browser&rsquo;s localStorage. Generation runs
              locally, so a key is optional — it&rsquo;s used only if you enable
              live AI in{" "}
              <code className="rounded bg-canvas-raised px-1 py-0.5 font-mono text-[11px] text-content-muted">
                lib/ai/config.js
              </code>
              .
            </p>
            <div className="relative">
              <input
                ref={inputRef}
                type={reveal ? "text" : "password"}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="sk-..."
                autoComplete="off"
                spellCheck={false}
                aria-label="OpenAI API key"
                className="w-full rounded-md border border-line bg-canvas-raised px-3 py-2.5 pr-10 font-mono text-[13px] text-content placeholder:text-content-faint transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                aria-label={reveal ? "Hide key" : "Show key"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-content-subtle transition-colors hover:text-content"
              >
                {reveal ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => {
                  clearApiKey();
                  setDraft("");
                  trigger("light");
                }}
                disabled={!draft}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12.5px] text-content-subtle transition-colors hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                {saved ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Saved
                  </>
                ) : (
                  "Save key"
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-medium uppercase tracking-wider text-content-subtle">
      {children}
    </h3>
  );
}

function SegButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? "bg-surface text-content shadow-glow-soft"
          : "text-content-subtle hover:text-content"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        on ? "bg-accent" : "bg-line-strong"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          on ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </span>
  );
}
