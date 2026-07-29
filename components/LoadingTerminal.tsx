"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { LoadingStep } from "@/lib/types";

const STEPS: LoadingStep[] = [
  { label: "Parsing application architecture", duration: 900 },
  { label: "Resolving Expo ecosystem dependencies", duration: 1050 },
  { label: "Optimizing package compatibility", duration: 850 },
];

interface LoadingTerminalProps {
  onComplete: () => void;
}

export function LoadingTerminal({ onComplete }: LoadingTerminalProps) {
  const [active, setActive] = useState(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    let elapsed = 0;
    STEPS.forEach((step, i) => {
      elapsed += step.duration;
      timers.push(
        setTimeout(() => {
          if (!cancelled) setActive(i + 1);
        }, elapsed),
      );
    });

    timers.push(
      setTimeout(() => {
        if (!cancelled) completeRef.current();
      }, elapsed + 450),
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section
      className="mx-auto mt-10 max-w-3xl animate-scale-in"
      aria-live="polite"
      aria-label="Generating stack"
    >
      <div className="overflow-hidden rounded-lg border border-line bg-canvas-raised shadow-panel">
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </div>
          <span className="ml-2 font-mono text-[12px] text-content-subtle">
            expo-init — zsh
          </span>
        </div>

        <div className="space-y-2.5 px-5 py-5 font-mono text-[13px] leading-relaxed">
          <div className="text-content-subtle">
            <span className="text-success">➜</span>{" "}
            <span className="text-accent">~/projects</span> expo-init generate
          </div>

          {STEPS.map((step, i) => {
            const state =
              i < active ? "done" : i === active ? "running" : "pending";
            return (
              <div
                key={step.label}
                className={`flex items-center gap-2.5 transition-all duration-300 ${
                  state === "pending"
                    ? "opacity-30"
                    : "opacity-100"
                }`}
                style={{
                  transform:
                    state === "pending" ? "translateY(2px)" : "translateY(0)",
                }}
              >
                <span className="text-content-faint">
                  [{i + 1}/{STEPS.length}]
                </span>
                {state === "done" ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : state === "running" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-line-strong" />
                )}
                <span
                  className={
                    state === "done"
                      ? "text-content-muted"
                      : state === "running"
                        ? "text-content"
                        : "text-content-subtle"
                  }
                >
                  {step.label}
                  {state === "done" ? "" : state === "running" ? "…" : ""}
                </span>
              </div>
            );
          })}

          {active >= STEPS.length && (
            <div className="flex items-center gap-2 pt-1 text-success animate-fade-in">
              <Check className="h-3.5 w-3.5" />
              Stack resolved. Rendering results…
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
