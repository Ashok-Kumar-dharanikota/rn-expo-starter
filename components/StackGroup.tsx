"use client";

import {
  Boxes,
  Bell,
  BrainCircuit,
  Camera,
  CreditCard,
  Database,
  Fingerprint,
  MapPin,
  Palette,
  Route,
  Sparkles,
  Waypoints,
  CheckCircle2,
  Star,
  Layers,
} from "lucide-react";
import type { PackageCategory, PackageTier, StackGroup as StackGroupType } from "@/lib/types";
import { PackageRow } from "./StackCard";

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Routing: <Route className="h-4 w-4" />,
  Styling: <Palette className="h-4 w-4" />,
  Animations: <Sparkles className="h-4 w-4" />,
  Authentication: <Fingerprint className="h-4 w-4" />,
  "Location & Maps": <MapPin className="h-4 w-4" />,
  Notifications: <Bell className="h-4 w-4" />,
  "Data & Sync": <Database className="h-4 w-4" />,
  Media: <Camera className="h-4 w-4" />,
  Payments: <CreditCard className="h-4 w-4" />,
  State: <Waypoints className="h-4 w-4" />,
  Storage: <Database className="h-4 w-4" />,
  AI: <BrainCircuit className="h-4 w-4" />,
  Core: <Boxes className="h-4 w-4" />,
  Essential: <CheckCircle2 className="h-4 w-4 text-success" />,
  Recommended: <Star className="h-4 w-4 text-accent" />,
  Optional: <Layers className="h-4 w-4 text-content-subtle" />,
};

interface StackGroupProps {
  group: StackGroupType;
  isSelected: (name: string) => boolean;
  onToggle: (name: string) => void;
  startIndex: number;
}

export function StackGroup({
  group,
  isSelected,
  onToggle,
  startIndex,
}: StackGroupProps) {
  const selectedCount = group.packages.filter((p) =>
    isSelected(p.name),
  ).length;

  const icon = CATEGORY_ICON[group.category] || <Boxes className="h-4 w-4" />;

  return (
    <div className="rounded-lg border border-line bg-canvas-raised/40 p-3">
      <div className="mb-2.5 flex items-center gap-2 px-1 pt-1">
        <span className="text-content-subtle">
          {icon}
        </span>
        <h4 className="text-[13.5px] font-semibold text-content">
          {group.category} Packages
        </h4>
        <span className="ml-auto rounded-full border border-line bg-surface px-2.5 py-0.5 text-[11px] font-medium text-content-subtle">
          {selectedCount}/{group.packages.length} selected
        </span>
      </div>
      <div className="grid gap-2.5">
        {group.packages.map((pkg, i) => (
          <PackageRow
            key={pkg.name}
            pkg={pkg}
            selected={isSelected(pkg.name)}
            onToggle={() => onToggle(pkg.name)}
            index={startIndex + i}
          />
        ))}
      </div>
    </div>
  );
}
