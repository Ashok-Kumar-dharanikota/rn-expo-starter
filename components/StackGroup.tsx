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
} from "lucide-react";
import type { PackageCategory, StackGroup as StackGroupType } from "@/lib/types";
import { PackageRow } from "./StackCard";

const CATEGORY_ICON: Record<PackageCategory, React.ReactNode> = {
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

  return (
    <div className="rounded-lg border border-line bg-canvas-raised/40 p-2.5">
      <div className="mb-2 flex items-center gap-2 px-1.5 pt-1">
        <span className="text-content-subtle">
          {CATEGORY_ICON[group.category]}
        </span>
        <h4 className="text-[13px] font-medium text-content">
          {group.category}
        </h4>
        <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[11px] text-content-subtle">
          {selectedCount}/{group.packages.length}
        </span>
      </div>
      <div className="grid gap-2">
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
