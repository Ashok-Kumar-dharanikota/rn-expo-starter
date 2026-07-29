"use client";

import { useEffect, useMemo, useState } from "react";
import { Layers, RotateCcw, Sparkles } from "lucide-react";
import type { GeneratedStack } from "@/lib/types";
import { flattenPackages } from "@/lib/generateStack";
import { useHaptics } from "@/lib/useHaptics";
import { StackGroup } from "./StackGroup";
import { TerminalPanel } from "./TerminalPanel";

interface GeneratedResultProps {
  stack: GeneratedStack;
  onReset: () => void;
}

export function GeneratedResult({ stack, onReset }: GeneratedResultProps) {
  const allPackages = useMemo(
    () => flattenPackages(stack.groups),
    [stack.groups],
  );
  const { trigger } = useHaptics();

  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Initialise selection from each stack's default-selected packages.
  useEffect(() => {
    setSelected(
      new Set(
        allPackages.filter((p) => p.defaultSelected).map((p) => p.name),
      ),
    );
  }, [allPackages]);

  const isSelected = (name: string) => selected.has(name);

  const toggle = (name: string) => {
    trigger("select");
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const resetSelection = () => {
    trigger("light");
    setSelected(
      new Set(allPackages.filter((p) => p.defaultSelected).map((p) => p.name)),
    );
  };

  const selectedPackages = useMemo(
    () => allPackages.filter((p) => selected.has(p.name)),
    [allPackages, selected],
  );

  let runningIndex = 0;

  return (
    <section className="mx-auto mt-10 max-w-6xl animate-fade-in">
      {/* Result header */}
      <div className="mb-6 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[12.5px]">
            <span className="flex items-center gap-1.5 text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success/60 animate-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Stack generated
            </span>
            <span
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
                stack.source === "ai"
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-line text-content-subtle"
              }`}
            >
              {stack.source === "ai" ? (
                <>
                  <Sparkles className="h-3 w-3" /> AI
                </>
              ) : (
                "Local engine"
              )}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-content">
            {stack.displayName}
          </h2>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-content-muted">
            {stack.summary}
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex shrink-0 items-center gap-1.5 self-start rounded-md border border-line px-3 py-2 text-[13px] text-content-muted transition-colors hover:border-line-strong hover:text-content sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          New idea
        </button>
      </div>

      {/* Two-panel layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        {/* Left — recommended stack, grouped */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-content-subtle" />
            <h3 className="text-[13px] font-medium uppercase tracking-wider text-content-muted">
              Recommended Stack
            </h3>
            <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] text-content-subtle">
              {selected.size} selected
            </span>
            <button
              onClick={resetSelection}
              className="ml-auto text-[12px] text-content-subtle transition-colors hover:text-content"
            >
              Reset
            </button>
          </div>

          <p className="mb-3 text-[12.5px] leading-relaxed text-content-subtle">
            Toggle any package to include or exclude it from the install command.
            Alternatives are off by default.
          </p>

          <div className="grid gap-3">
            {stack.groups.map((group) => {
              const start = runningIndex;
              runningIndex += group.packages.length;
              return (
                <StackGroup
                  key={group.category}
                  group={group}
                  isSelected={isSelected}
                  onToggle={toggle}
                  startIndex={start}
                />
              );
            })}
          </div>
        </div>

        {/* Right — terminal, driven by selection */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <TerminalPanel stack={stack} selectedPackages={selectedPackages} />
        </div>
      </div>
    </section>
  );
}
