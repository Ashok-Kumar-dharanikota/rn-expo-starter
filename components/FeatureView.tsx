"use client";

import { useMemo, useState } from "react";
import { Layers, PlusCircle, ShieldCheck } from "lucide-react";
import type { GeneratedStack, StackPackage } from "@/lib/types";
import type { Capability, DerivedCapability } from "@/lib/capabilities";
import { useHaptics } from "@/lib/useHaptics";
import { CapabilityCard } from "./CapabilityCard";
import { FeaturePreview } from "./mockups/FeaturePreview";
import { TerminalPanel } from "./TerminalPanel";

interface FeatureViewProps {
  stack: GeneratedStack;
  derived: DerivedCapability[];
}

/** Feature-first ("Simple") experience: plain-language capabilities. */
export function FeatureView({ stack, derived }: FeatureViewProps) {
  const { trigger } = useHaptics();

  const foundation = derived.find((d) => d.capability.foundation);
  const recommended = derived.filter(
    (d) => d.recommended && !d.capability.foundation,
  );
  const more = derived.filter(
    (d) => !d.recommended && !d.capability.foundation,
  );

  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(derived.filter((d) => d.recommended).map((d) => d.capability.id)),
  );

  const [activeId, setActiveId] = useState<string>(
    recommended[0]?.capability.id ?? foundation?.capability.id ?? "foundation",
  );

  const toggleCap = (cap: Capability) => {
    if (cap.foundation) return;
    trigger("select");
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(cap.id)) next.delete(cap.id);
      else next.add(cap.id);
      return next;
    });
    setActiveId(cap.id);
  };

  const activeCap =
    derived.find((d) => d.capability.id === activeId)?.capability ??
    foundation?.capability ??
    derived[0].capability;

  // Merge all enabled capabilities' packages into the install universe.
  const selectedPackages: StackPackage[] = useMemo(() => {
    const seen = new Set<string>();
    const out: StackPackage[] = [];
    for (const d of derived) {
      if (!enabled.has(d.capability.id)) continue;
      for (const p of d.capability.packages) {
        if (!seen.has(p.name)) {
          seen.add(p.name);
          out.push(p);
        }
      }
    }
    return out;
  }, [derived, enabled]);

  const enabledFeatureCount = Array.from(enabled).filter(
    (id) => id !== "foundation",
  ).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Left — capabilities */}
      <div className="space-y-6">
        {/* Foundation */}
        {foundation && (
          <div>
            <SectionHeading
              icon={<ShieldCheck className="h-4 w-4 text-success" />}
              title="Included automatically"
              hint="The basics every app needs"
            />
            <CapabilityCard
              capability={foundation.capability}
              enabled
              active={activeId === foundation.capability.id}
              onToggle={() => {}}
              onActivate={() => setActiveId(foundation.capability.id)}
              index={0}
            />
          </div>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <div>
            <SectionHeading
              icon={<Layers className="h-4 w-4 text-accent" />}
              title="Recommended for your app"
              hint={`${enabledFeatureCount} on`}
            />
            <div className="grid gap-2.5">
              {recommended.map((d, i) => (
                <CapabilityCard
                  key={d.capability.id}
                  capability={d.capability}
                  enabled={enabled.has(d.capability.id)}
                  active={activeId === d.capability.id}
                  onToggle={() => toggleCap(d.capability)}
                  onActivate={() => setActiveId(d.capability.id)}
                  index={i + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add more */}
        {more.length > 0 && (
          <div>
            <SectionHeading
              icon={<PlusCircle className="h-4 w-4 text-content-subtle" />}
              title="Add more capabilities"
              hint="Everything you might need on day one"
            />
            <div className="grid gap-2.5 sm:grid-cols-2">
              {more.map((d, i) => (
                <CapabilityCard
                  key={d.capability.id}
                  capability={d.capability}
                  enabled={enabled.has(d.capability.id)}
                  active={activeId === d.capability.id}
                  onToggle={() => toggleCap(d.capability)}
                  onActivate={() => setActiveId(d.capability.id)}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right — sticky preview + install command */}
      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <FeaturePreview
          scene={activeCap.scene}
          label={activeCap.label}
          description={activeCap.description}
        />
        <TerminalPanel stack={stack} selectedPackages={selectedPackages} />
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      {icon}
      <h3 className="text-[13px] font-semibold text-content">{title}</h3>
      {hint && (
        <span className="ml-auto text-[11.5px] text-content-subtle">{hint}</span>
      )}
    </div>
  );
}
