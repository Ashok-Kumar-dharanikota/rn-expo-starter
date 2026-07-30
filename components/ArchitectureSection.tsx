"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ArchitectureSectionProps {
  id?: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ArchitectureSection({
  icon,
  title,
  subtitle,
  badge,
  defaultOpen = true,
  children,
}: ArchitectureSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-canvas-raised transition-all">
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border-b border-line/60 px-5 py-4 text-left transition-colors hover:bg-surface/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-accent">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-semibold tracking-tight text-content">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-[12.5px] text-content-muted">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-content-subtle transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Section Content */}
      {isOpen && <div className="p-5">{children}</div>}
    </div>
  );
}
