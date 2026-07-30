"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Cpu,
  FolderTree,
  GitBranch,
  Info,
  Key,
  Layers,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";
import type { GeneratedStack } from "@/lib/types";
import { flattenPackages } from "@/lib/generateStack";
import { useHaptics } from "@/lib/useHaptics";
import { StackGroup } from "./StackGroup";
import { TerminalPanel } from "./TerminalPanel";
import { ArchitectureSection } from "./ArchitectureSection";
import { CodeBlock } from "./ui/CodeBlock";
import { FeatureView } from "./FeatureView";
import { deriveCapabilities } from "@/lib/capabilities";

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

  // Initialise selection from default-selected packages.
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

  // Feature-first layer: derive plain-language capabilities from the stack.
  const [view, setView] = useState<"simple" | "developer">("simple");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const derivedCaps = useMemo(() => {
    const present = new Set(allPackages.map((p) => p.name));
    const pseudoPrompt = `${stack.displayName} ${stack.summary} ${
      stack.category ?? ""
    }`;
    return deriveCapabilities(present, pseudoPrompt);
  }, [allPackages, stack.displayName, stack.summary, stack.category]);
  const showDashboard = view === "developer" || advancedOpen;

  let runningIndex = 0;

  return (
    <section className="mx-auto mt-10 max-w-6xl animate-fade-in pb-16">
      {/* Result Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-[12.5px]">
            <span className="flex items-center gap-1.5 font-medium text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success/60 animate-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Solution Blueprint Ready
            </span>
            <span
              className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                stack.source === "ai"
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-line bg-surface text-content-subtle"
              }`}
            >
              {stack.source === "ai" ? (
                <>
                  <Sparkles className="h-3 w-3" /> Principal AI Architect
                </>
              ) : (
                "Local Architect Engine"
              )}
            </span>
            {stack.category && (
              <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[11px] text-content-muted">
                {stack.category}
              </span>
            )}
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-content">
            {stack.displayName}
          </h2>
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-content-muted">
            {stack.summary}
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex shrink-0 items-center gap-1.5 self-start rounded-md border border-line bg-surface/50 px-3.5 py-2 text-[13px] font-medium text-content-muted transition-colors hover:border-line-strong hover:bg-surface hover:text-content sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          New Architecture Prompt
        </button>
      </div>

      {/* Mode toggle: Simple (features) vs Developer (packages + analysis) */}
      <div className="mb-6 inline-flex rounded-md border border-line bg-canvas-raised p-1">
        <ModeButton
          active={view === "simple"}
          onClick={() => setView("simple")}
          label="Simple"
          hint="Features"
        />
        <ModeButton
          active={view === "developer"}
          onClick={() => setView("developer")}
          label="Developer"
          hint="Packages + analysis"
        />
      </div>

      {view === "simple" && (
        <FeatureView stack={stack} derived={derivedCaps} />
      )}

      {view === "simple" && (
        <button
          onClick={() => setAdvancedOpen((o) => !o)}
          className="mt-6 flex w-full items-center justify-between rounded-lg border border-line bg-canvas-raised px-5 py-3.5 text-left transition-colors hover:bg-surface/50"
        >
          <span className="flex flex-wrap items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 text-content-subtle" />
            <span className="text-sm font-semibold text-content">
              Advanced architecture details
            </span>
            <span className="text-[12px] text-content-subtle">
              cost, risks, roadmap, folder structure &amp; more
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-content-subtle transition-transform ${
              advancedOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* 12 Collapsible Architecture Dashboard Sections */}
      {showDashboard && (
      <div className="mt-4 space-y-4">
        
        {/* 1. EXECUTIVE ARCHITECTURE SUMMARY */}
        <ArchitectureSection
          icon={<Info className="h-4 w-4" />}
          title="1. Executive Architecture Summary"
          subtitle="System classification, readiness indicators, financial estimates, and potential risks"
          badge={
            stack.evaluation?.overallScore ? (
              <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                Readiness: {stack.evaluation.overallScore}/100
              </span>
            ) : null
          }
          defaultOpen={true}
        >
          {/* Executive Overview Grid */}
          <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-4">
            <MetricCard
              label="Application Type"
              value={stack.executiveSummary?.applicationType || stack.category}
              tone="content"
            />
            <MetricCard
              label="System Complexity"
              value={stack.executiveSummary?.complexity}
              tone="warning"
            />
            <MetricCard
              label="Estimated Dev Time"
              value={stack.executiveSummary?.estimatedDevTime}
              tone="accent"
            />
            <MetricCard
              label="Estimated Monthly Cost"
              value={stack.executiveSummary?.estimatedMonthlyCost}
              tone="success"
            />
          </div>

          {/* Readiness Indicators */}
          {stack.executiveSummary?.readinessFlags && (
            <div className="mt-3.5 rounded-md border border-line bg-surface/30 p-3.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-content-subtle">
                Core Subsystem Readiness Status
              </span>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11.5px]">
                <span className={`rounded-full border px-2.5 py-0.5 font-medium ${stack.executiveSummary.readinessFlags.offlineReady ? "border-success/30 bg-success/10 text-success" : "border-line text-content-subtle"}`}>
                  {stack.executiveSummary.readinessFlags.offlineReady ? "✓ Offline Ready" : "✗ Offline Disabled"}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 font-medium ${stack.executiveSummary.readinessFlags.authReady ? "border-success/30 bg-success/10 text-success" : "border-line text-content-subtle"}`}>
                  {stack.executiveSummary.readinessFlags.authReady ? "✓ Auth Ready" : "✗ Auth Pending"}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 font-medium ${stack.executiveSummary.readinessFlags.paymentsReady ? "border-success/30 bg-success/10 text-success" : "border-line text-content-subtle"}`}>
                  {stack.executiveSummary.readinessFlags.paymentsReady ? "✓ Payments Ready" : "✗ Payments Optional"}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 font-medium ${stack.executiveSummary.readinessFlags.analyticsReady ? "border-success/30 bg-success/10 text-success" : "border-line text-content-subtle"}`}>
                  {stack.executiveSummary.readinessFlags.analyticsReady ? "✓ Analytics Ready" : "✗ Analytics Pending"}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 font-medium ${stack.executiveSummary.readinessFlags.notificationReady ? "border-success/30 bg-success/10 text-success" : "border-line text-content-subtle"}`}>
                  {stack.executiveSummary.readinessFlags.notificationReady ? "✓ Push Ready" : "✗ Push Optional"}
                </span>
                <span className="ml-auto text-[11px] text-content-subtle">
                  {stack.executiveSummary.expoCompatibility}
                </span>
              </div>
            </div>
          )}

          {/* Potential Risks & Improvements */}
          {stack.executiveSummary && (
            <div className="mt-3.5 grid gap-3.5 md:grid-cols-2">
              <div className="rounded-md border border-danger/20 bg-danger/5 p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-danger">
                  Potential Technical Risks
                </span>
                <ul className="mt-1.5 space-y-1">
                  {stack.executiveSummary.potentialRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[12px] text-content-muted">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-md border border-accent/20 bg-accent/5 p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                  Recommended Improvements
                </span>
                <ul className="mt-1.5 space-y-1">
                  {stack.executiveSummary.recommendedImprovements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[12px] text-content-muted">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Architecture Score Metric Bars */}
          {stack.evaluation?.scoreBreakdown && (
            <div className="mt-3.5 rounded-md border border-line bg-surface/20 p-3.5">
              <h5 className="mb-2.5 text-[11.5px] font-medium uppercase tracking-wider text-content-subtle">
                Architecture Quality Metric Breakdown
              </h5>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {Object.entries(stack.evaluation.scoreBreakdown).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-[11.5px]">
                      <span className="capitalize text-content-muted">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-semibold text-content">{val}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ArchitectureSection>

        {/* 2. DETECTED FEATURES */}
        <ArchitectureSection
          icon={<CheckCircle2 className="h-4 w-4" />}
          title="2. Detected Features"
          subtitle="Capabilities extracted directly from your application prompt"
          badge={
            <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] text-content-subtle">
              {stack.detectedFeatures?.length || 0} features
            </span>
          }
          defaultOpen={false}
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {stack.detectedFeatures?.map((feat) => (
              <div key={feat.id} className="flex items-start gap-2.5 rounded-md border border-line bg-surface/40 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-content">{feat.name}</span>
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                      {feat.priority}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-content-muted">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ArchitectureSection>

        {/* 3. INFERRED FEATURES */}
        <ArchitectureSection
          icon={<Sparkles className="h-4 w-4" />}
          title="3. Inferred Production Features"
          subtitle="Implicit safeguards & infrastructure added by the Principal Architect"
          badge={
            <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
              Architect Inferred
            </span>
          }
          defaultOpen={false}
        >
          <div className="space-y-2.5">
            {stack.inferredFeatures?.map((feat) => (
              <div key={feat.id} className="rounded-md border border-line bg-surface/40 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs font-semibold text-content">{feat.name}</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      feat.ommissionRisk === "Critical"
                        ? "bg-danger/10 text-danger border border-danger/20"
                        : "bg-surface text-content-subtle"
                    }`}
                  >
                    Risk: {feat.ommissionRisk}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-content-muted">
                  {feat.justification}
                </p>
              </div>
            ))}
          </div>
        </ArchitectureSection>

        {/* 4. ARCHITECTURE DECISIONS & RATIONALES */}
        <ArchitectureSection
          icon={<Cpu className="h-4 w-4" />}
          title="4. Architecture Decisions & Architectural Rationales"
          subtitle="System decisions and educational rationale matrices across 14 engineering domains"
          defaultOpen={false}
        >
          {/* Executive Strategy Cards */}
          {stack.architectureDecisions && (
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-line bg-surface/40 p-3.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-content-subtle">
                  State Management Strategy
                </span>
                <p className="mt-1 text-xs font-semibold text-content">
                  Client: {stack.architectureDecisions.stateStrategy.clientState}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-content">
                  Server: {stack.architectureDecisions.stateStrategy.serverState}
                </p>
                <p className="mt-1.5 text-[12px] text-content-muted">
                  {stack.architectureDecisions.stateStrategy.rationale}
                </p>
              </div>

              <div className="rounded-md border border-line bg-surface/40 p-3.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-content-subtle">
                  Offline & Storage Engine
                </span>
                <p className="mt-1 text-xs font-semibold text-content">
                  Database: {stack.architectureDecisions.dataPersistence.primaryStorage}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-content">
                  Mode: {stack.architectureDecisions.offlineStrategy.mode}
                </p>
                <p className="mt-1.5 text-[12px] text-content-muted">
                  Conflict Resolution: {stack.architectureDecisions.offlineStrategy.conflictResolution}
                </p>
              </div>
            </div>
          )}

          {/* 14 Domain Educational Rationale Cards */}
          {stack.rationales && (
            <div className="space-y-3">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-content-muted">
                14-Domain Architectural Rationales (&quot;Why &amp; When&quot;)
              </h4>
              <div className="grid gap-3.5 md:grid-cols-2">
                {stack.rationales.map((rat, idx) => (
                  <div key={idx} className="flex flex-col justify-between rounded-md border border-line bg-surface/40 p-4 transition-colors hover:border-line-strong">
                    <div>
                      <div className="flex items-center justify-between border-b border-line/50 pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                          {rat.domain}
                        </span>
                        <span className="rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                          {rat.recommendation}
                        </span>
                      </div>

                      <div className="mt-3">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-content-subtle">
                          Reasoning (Why Chosen):
                        </span>
                        <ul className="mt-1 space-y-1">
                          {rat.reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[12px] text-content-muted">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3.5 border-t border-line/50 pt-2.5">
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-content-subtle">Alternative:</span>
                        <span className="font-medium text-content">{rat.alternative}</span>
                      </div>
                      <p className="mt-1 text-[11.5px] italic leading-relaxed text-content-subtle">
                        <span className="font-semibold text-content-muted">When to use alternative:</span> {rat.whenToUseAlternative}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ArchitectureSection>

        {/* 5. PACKAGES */}
        <ArchitectureSection
          icon={<Box className="h-4 w-4" />}
          title="5. Recommended Packages & Toggles"
          subtitle="Verified Expo SDK & community libraries with interactive toggles"
          badge={
            <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-accent">
              {selected.size} selected
            </span>
          }
          defaultOpen={true}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12.5px] text-content-subtle">
              Toggle any package to update your command & config live.
            </span>
            <button
              onClick={resetSelection}
              className="text-[12px] font-medium text-content-subtle transition-colors hover:text-content"
            >
              Reset to Defaults
            </button>
          </div>

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
        </ArchitectureSection>

        {/* 6. CLOUD & BAAS SERVICES */}
        <ArchitectureSection
          icon={<Cloud className="h-4 w-4" />}
          title="6. Recommended Cloud & BaaS Services (14 Categories)"
          subtitle="Backend, database, auth, payments, search, storage, telemetry, and AI infrastructure"
          badge={
            <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-accent">
              {stack.cloudServices?.length || 0} services
            </span>
          }
          defaultOpen={false}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {stack.cloudServices?.map((srv) => (
              <div key={srv.id} className="flex flex-col justify-between rounded-md border border-line bg-surface/40 p-4 transition-colors hover:border-line-strong">
                <div>
                  <div className="flex items-center justify-between border-b border-line/50 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-content">{srv.name}</span>
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-accent">
                        {srv.serviceType}
                      </span>
                    </div>
                    <span className="rounded bg-surface px-2 py-0.5 text-[10.5px] font-medium text-content-subtle">
                      Setup: {srv.easeOfSetup}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-2">
                    <p className="text-[12.5px] font-medium text-content">
                      {srv.purpose}
                    </p>
                    <p className="text-[12px] leading-relaxed text-content-muted">
                      <span className="font-semibold text-content-subtle">Why chosen: </span>
                      {srv.whyChosen}
                    </p>
                    <div className="text-[11.5px] text-content-muted">
                      <span className="font-semibold text-content-subtle">Pricing: </span>
                      <span className="text-success">{srv.pricing}</span>
                    </div>
                    <div className="text-[11.5px] text-content-muted">
                      <span className="font-semibold text-content-subtle">Expo Compatibility: </span>
                      {srv.expoCompatibility}
                    </div>
                    <div className="text-[11.5px] text-content-muted">
                      <span className="font-semibold text-content-subtle">Production Suitability: </span>
                      {srv.productionSuitability}
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-line/40 pt-2 text-[11px]">
                  {srv.alternatives && srv.alternatives.length > 0 && (
                    <span className="text-content-subtle">
                      Alt: <span className="text-content-muted">{srv.alternatives.join(", ")}</span>
                    </span>
                  )}
                  {srv.docUrl && (
                    <a
                      href={srv.docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto flex items-center gap-1 text-content-subtle transition-colors hover:text-accent"
                    >
                      <span>Service Docs</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ArchitectureSection>

        {/* 7. FOLDER STRUCTURE */}
        <ArchitectureSection
          icon={<FolderTree className="h-4 w-4" />}
          title="7. Recommended Folder Structure"
          subtitle="Production Expo Router file-based directory tree AST"
          defaultOpen={false}
        >
          <CodeBlock code={stack.folderStructure} language="tree" showLineNumbers={false} />
        </ArchitectureSection>

        {/* 8. ENVIRONMENT VARIABLES */}
        <ArchitectureSection
          icon={<Key className="h-4 w-4" />}
          title="8. Environment Variables (.env.example)"
          subtitle="Public EXPO_PUBLIC_* variables and secret backend keys"
          defaultOpen={false}
        >
          <div className="space-y-2 font-mono text-[12px]">
            {stack.environmentVariables?.map((env) => (
              <div key={env.key} className="flex flex-col gap-1 rounded-md border border-line bg-surface/40 p-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-content">{env.key}</span>
                  {env.isPublic && (
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                      EXPO_PUBLIC
                    </span>
                  )}
                </div>
                <span className="text-[11.5px] text-content-muted">{env.description}</span>
              </div>
            ))}
          </div>
        </ArchitectureSection>

        {/* 9. APP.JSON */}
        <ArchitectureSection
          icon={<SlidersHorizontal className="h-4 w-4" />}
          title="9. Expo App Configuration (app.json)"
          subtitle="Generated Expo Config Plugins, deep link scheme, and build properties"
          defaultOpen={false}
        >
          <CodeBlock code={stack.appJson} language="json" />
        </ArchitectureSection>

        {/* 10. PERMISSIONS */}
        <ArchitectureSection
          icon={<ShieldCheck className="h-4 w-4" />}
          title="10. Native Permissions Matrix"
          subtitle="iOS Info.plist & Android Manifest permission declarations"
          defaultOpen={false}
        >
          <div className="space-y-2">
            {stack.permissions?.map((perm, i) => (
              <div key={i} className="flex items-start justify-between rounded-md border border-line bg-surface/40 p-3">
                <div>
                  <span className="font-mono text-xs font-semibold text-content">{perm.permissionKey}</span>
                  <p className="mt-0.5 text-[12px] text-content-muted">{perm.userPromptReason}</p>
                </div>
                <span className="shrink-0 rounded bg-surface px-2 py-0.5 text-[10.5px] font-medium text-content-subtle">
                  {perm.platform.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </ArchitectureSection>

        {/* 11. INSTALLATION COMMAND */}
        <ArchitectureSection
          icon={<TerminalSquare className="h-4 w-4" />}
          title="11. Terminal Installation Commands"
          subtitle="Single-click executable terminal commands for your selected packages"
          defaultOpen={true}
        >
          <TerminalPanel stack={stack} selectedPackages={selectedPackages} />
        </ArchitectureSection>

        {/* 12. DEVELOPMENT ROADMAP */}
        <ArchitectureSection
          icon={<GitBranch className="h-4 w-4" />}
          title="12. Phased Development Roadmap"
          subtitle="Sequential implementation execution plan from setup to store submission"
          defaultOpen={false}
        >
          <div className="space-y-3">
            {stack.roadmap?.map((phase) => (
              <div key={phase.phaseNumber} className="rounded-md border border-line bg-surface/40 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                    Phase {phase.phaseNumber}: {phase.title}
                  </h4>
                  <span className="text-[11.5px] text-content-subtle">
                    ~{phase.estimatedDays} Days
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-content-muted">{phase.description}</p>
                <div className="mt-3 space-y-1.5">
                  {phase.milestones.map((ms) => (
                    <div key={ms.id} className="flex items-center gap-2 text-[12px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="font-medium text-content">{ms.task}</span>
                      <span className="ml-auto text-[11px] text-content-subtle">— {ms.deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ArchitectureSection>

      </div>
      )}
    </section>
  );
}

/** A dashboard metric that shows an honest empty state when data is missing. */
function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value?: string | null;
  tone: "content" | "accent" | "success" | "warning";
}) {
  const toneClass = value
    ? {
        content: "text-content",
        accent: "text-accent",
        success: "text-success",
        warning: "text-warning",
      }[tone]
    : "text-content-subtle";
  return (
    <div className="rounded-md border border-line bg-surface/40 p-3.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-content-subtle">
        {label}
      </span>
      <p className={`mt-1 text-xs font-bold tabular-nums ${toneClass}`}>
        {value || "Not estimated"}
      </p>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? "bg-surface text-content shadow-glow-soft"
          : "text-content-subtle hover:text-content"
      }`}
    >
      {label}
      <span className="text-[11px] font-normal text-content-subtle">{hint}</span>
    </button>
  );
}
