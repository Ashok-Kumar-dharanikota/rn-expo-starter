"use client";

import { Check } from "lucide-react";
import type { StackPackage } from "@/lib/types";

interface PackageRowProps {
  pkg: StackPackage;
  selected: boolean;
  onToggle: () => void;
  index: number;
}

/** A single package with a circular include/exclude toggle. */
export function PackageRow({ pkg, selected, onToggle, index }: PackageRowProps) {
  return (
    <div
      className={`group animate-fade-in-up rounded-lg border p-3.5 transition-all duration-200 ${
        selected
          ? "border-line bg-surface"
          : "border-dashed border-line bg-transparent"
      } hover:border-line-strong`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          role="switch"
          aria-checked={selected}
          aria-label={`${selected ? "Remove" : "Add"} ${pkg.name} ${
            selected ? "from" : "to"
          } the install command`}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
            selected
              ? "border-accent bg-accent text-accent-foreground"
              : "border-line-strong text-transparent hover:border-accent/60"
          }`}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <code
              className={`font-mono text-[13.5px] font-medium transition-colors ${
                selected ? "text-content" : "text-content-muted"
              }`}
            >
              {pkg.name}
            </code>
            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] ${
                pkg.installer === "expo"
                  ? "bg-accent/10 text-accent"
                  : "bg-surface-raised text-content-subtle"
              }`}
            >
              {pkg.installer}
            </span>
            {pkg.optional && (
              <span className="rounded-full border border-line px-1.5 py-0.5 text-[10.5px] text-content-subtle">
                alternative
              </span>
            )}
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-content-muted">
            {pkg.reason}
          </p>
        </div>
      </div>
    </div>
  );
}
