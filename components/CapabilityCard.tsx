"use client";

import { useState } from "react";
import {
  BarChart3,
  Bell,
  Boxes,
  BrainCircuit,
  Camera,
  Check,
  ChevronDown,
  ClipboardList,
  Cloud,
  CreditCard,
  Database,
  Fingerprint,
  Image as ImageIcon,
  Languages,
  MapPin,
  Megaphone,
  MessageSquare,
  Mic,
  RefreshCw,
  ShieldAlert,
  Share2,
  Smartphone,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { Capability } from "@/lib/capabilities";

const ICONS: Record<string, React.ReactNode> = {
  foundation: <Boxes className="h-4 w-4" />,
  auth: <Fingerprint className="h-4 w-4" />,
  cloud: <Cloud className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  payments: <CreditCard className="h-4 w-4" />,
  notifications: <Bell className="h-4 w-4" />,
  maps: <MapPin className="h-4 w-4" />,
  camera: <Camera className="h-4 w-4" />,
  media: <ImageIcon className="h-4 w-4" />,
  chat: <MessageSquare className="h-4 w-4" />,
  ai: <BrainCircuit className="h-4 w-4" />,
  analytics: <BarChart3 className="h-4 w-4" />,
  monitoring: <ShieldAlert className="h-4 w-4" />,
  storage: <ClipboardList className="h-4 w-4" />,
  animations: <Wand2 className="h-4 w-4" />,
  forms: <ClipboardList className="h-4 w-4" />,
  i18n: <Languages className="h-4 w-4" />,
  sharing: <Share2 className="h-4 w-4" />,
  updates: <RefreshCw className="h-4 w-4" />,
  ads: <Megaphone className="h-4 w-4" />,
  device: <Smartphone className="h-4 w-4" />,
  audio: <Mic className="h-4 w-4" />,
};

interface CapabilityCardProps {
  capability: Capability;
  enabled: boolean;
  active: boolean;
  onToggle: () => void;
  onActivate: () => void;
  index: number;
}

export function CapabilityCard({
  capability,
  enabled,
  active,
  onToggle,
  onActivate,
  index,
}: CapabilityCardProps) {
  const [showPackages, setShowPackages] = useState(false);
  const locked = capability.foundation;

  return (
    <div
      onMouseEnter={onActivate}
      onFocusCapture={onActivate}
      className={`group animate-fade-in-up rounded-lg border p-3.5 transition-all duration-200 ${
        active
          ? "border-accent/50 bg-surface shadow-glow-soft"
          : enabled
            ? "border-line bg-surface"
            : "border-dashed border-line/70 bg-transparent"
      }`}
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => !locked && onToggle()}
          role="switch"
          aria-checked={enabled}
          disabled={locked}
          aria-label={`${enabled ? "Remove" : "Add"} ${capability.label}`}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
            enabled
              ? "border-accent bg-accent text-accent-foreground"
              : "border-line-strong text-transparent hover:border-accent/60"
          } ${locked ? "cursor-not-allowed opacity-90" : ""}`}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`shrink-0 ${active ? "text-accent" : "text-content-subtle"}`}
            >
              {ICONS[capability.id] ?? <Boxes className="h-4 w-4" />}
            </span>
            <h4 className="text-[13.5px] font-semibold text-content">
              {capability.label}
            </h4>
            {locked && (
              <span className="rounded-full border border-line px-1.5 py-0.5 text-[10px] text-content-subtle">
                Always included
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-content-muted">
            {capability.description}
          </p>

          <button
            onClick={() => setShowPackages((s) => !s)}
            className="mt-2 flex items-center gap-1 text-[11.5px] text-content-subtle transition-colors hover:text-content"
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showPackages ? "rotate-180" : ""}`}
            />
            {capability.packages.length} package
            {capability.packages.length === 1 ? "" : "s"}
          </button>

          {showPackages && (
            <div className="mt-2 space-y-1.5 border-t border-line/50 pt-2">
              {capability.packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className="flex items-center gap-2 text-[11.5px]"
                >
                  <code className="font-mono text-content-muted">
                    {pkg.name}
                  </code>
                  <span
                    className={`rounded px-1 py-0.5 font-mono text-[9.5px] ${
                      pkg.installer === "expo"
                        ? "bg-accent/10 text-accent"
                        : "bg-surface-raised text-content-subtle"
                    }`}
                  >
                    {pkg.installer}
                  </span>
                  {pkg.tier && pkg.tier !== "Essential" && (
                    <span className="text-[10px] text-content-subtle">
                      {pkg.tier.toLowerCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
