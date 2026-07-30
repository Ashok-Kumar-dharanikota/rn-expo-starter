"use client";

import { Check, ExternalLink, ShieldAlert, Sparkles } from "lucide-react";
import type { StackPackage } from "@/lib/types";

interface PackageRowProps {
  pkg: StackPackage;
  selected: boolean;
  onToggle: () => void;
  index: number;
}

/** A single package card displaying tier, purpose, reasoning, config requirements, and docs. */
export function PackageRow({ pkg, selected, onToggle, index }: PackageRowProps) {
  const tier = pkg.tier || (pkg.optional ? "Optional" : "Essential");
  const purpose = pkg.purpose || pkg.reason;
  const compatibility = pkg.expoCompatibility || "Expo SDK 52+ Compatible";
  const docs = pkg.docUrl || `https://docs.expo.dev/versions/latest/sdk/overview/`;

  return (
    <div
      className={`group animate-fade-in-up rounded-lg border p-4 transition-all duration-200 ${
        selected
          ? "border-line bg-surface"
          : "border-dashed border-line/60 bg-transparent opacity-85"
      } hover:border-line-strong`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Switch */}
        <button
          onClick={onToggle}
          role="switch"
          aria-checked={selected}
          aria-label={`${selected ? "Remove" : "Add"} ${pkg.name}`}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
            selected
              ? "border-accent bg-accent text-accent-foreground"
              : "border-line-strong text-transparent hover:border-accent/60"
          }`}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          {/* Top Row: Package Name, Installer, Tier Badge, Compatibility */}
          <div className="flex flex-wrap items-center gap-2">
            <code
              className={`font-mono text-[14px] font-semibold transition-colors ${
                selected ? "text-content" : "text-content-muted"
              }`}
            >
              {pkg.name}
            </code>

            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] font-medium ${
                pkg.installer === "expo"
                  ? "bg-accent/10 text-accent"
                  : "bg-surface-raised text-content-subtle"
              }`}
            >
              {pkg.installer === "expo" ? "npx expo install" : "npm install"}
            </span>

            {/* Tier Badge */}
            <span
              className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                tier === "Essential"
                  ? "border border-success/30 bg-success/10 text-success"
                  : tier === "Recommended"
                  ? "border border-accent/30 bg-accent/10 text-accent"
                  : "border border-line bg-surface text-content-subtle"
              }`}
            >
              {tier}
            </span>

            <span className="ml-auto text-[11px] text-content-subtle">
              {compatibility}
            </span>
          </div>

          {/* Purpose & Reasoning */}
          <div className="mt-2 space-y-1">
            <p className="text-[12.5px] font-medium text-content">
              {purpose}
            </p>
            <p className="text-[12px] leading-relaxed text-content-muted">
              <span className="font-semibold text-content-subtle">Why selected: </span>
              {pkg.reason}
            </p>
          </div>

          {/* Config Needed & Alternatives & Docs */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/40 pt-2.5 text-[11.5px]">
            {pkg.configNeeded ? (
              <span className="flex items-center gap-1 text-warning">
                <ShieldAlert className="h-3 w-3" />
                <span>Config: {pkg.configNeeded}</span>
              </span>
            ) : pkg.hasConfigPlugin ? (
              <span className="flex items-center gap-1 text-accent">
                <Sparkles className="h-3 w-3" />
                <span>app.json plugin required</span>
              </span>
            ) : (
              <span className="text-content-subtle">Zero extra config needed</span>
            )}

            <div className="flex items-center gap-3">
              {pkg.alternatives && pkg.alternatives.length > 0 && (
                <span className="text-content-subtle">
                  Alt: <span className="text-content-muted">{pkg.alternatives.join(", ")}</span>
                </span>
              )}

              <a
                href={docs}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-content-subtle transition-colors hover:text-accent"
              >
                <span>Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
