"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  FolderTree,
  SlidersHorizontal,
  TerminalSquare,
} from "lucide-react";
import type { GeneratedStack, OutputView, StackPackage } from "@/lib/types";
import { buildAppJson, buildCommands } from "@/lib/generateStack";
import { useHaptics } from "@/lib/useHaptics";
import { CodeBlock } from "./ui/CodeBlock";

interface TerminalPanelProps {
  stack: GeneratedStack;
  selectedPackages: StackPackage[];
}

export function TerminalPanel({ stack, selectedPackages }: TerminalPanelProps) {
  const [view, setView] = useState<OutputView>(stack.defaultView);
  const [copied, setCopied] = useState(false);
  const { trigger } = useHaptics();

  const commands = useMemo(
    () => buildCommands(selectedPackages),
    [selectedPackages],
  );
  const appJson = useMemo(
    () => buildAppJson(stack.appName, stack.displayName, selectedPackages),
    [stack.appName, stack.displayName, selectedPackages],
  );

  const expoPkgs = selectedPackages
    .filter((p) => p.installer === "expo")
    .map((p) => p.name);
  const npmPkgs = selectedPackages
    .filter((p) => p.installer === "npm")
    .map((p) => p.name);

  const copyCommand = async () => {
    const text = [commands.expo, commands.npm].filter(Boolean).join("\n");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      trigger("success");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-canvas-raised shadow-panel">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </div>
          <span className="ml-2 flex items-center gap-1.5 font-mono text-[12px] text-content-subtle">
            <TerminalSquare className="h-3.5 w-3.5" />
            {stack.appName} — terminal
          </span>
        </div>
        <button
          onClick={copyCommand}
          disabled={!commands.expo && !commands.npm}
          className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-[12px] text-content-muted transition-colors hover:border-line-strong hover:text-content disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Command
            </>
          )}
        </button>
      </div>

      {/* Install command(s) */}
      <div className="space-y-2 border-b border-line px-5 py-4 font-mono text-[12.5px] leading-[1.7]">
        {expoPkgs.length > 0 && (
          <CommandLine
            prefix={
              <>
                <span className="text-content-muted">npx</span>{" "}
                <span className="text-accent">expo</span>{" "}
                <span className="text-content">install</span>
              </>
            }
            packages={expoPkgs}
          />
        )}
        {npmPkgs.length > 0 && (
          <CommandLine
            prefix={
              <>
                <span className="text-content-muted">npm</span>{" "}
                <span className="text-content">install</span>
              </>
            }
            packages={npmPkgs}
          />
        )}
        {expoPkgs.length === 0 && npmPkgs.length === 0 && (
          <div className="text-content-subtle">
            <span className="select-none">#</span> select packages to build the
            install command
          </div>
        )}
      </div>

      {/* View switch */}
      <div className="flex items-center gap-1 border-b border-line px-3 py-2">
        <TabButton
          active={view === "structure"}
          onClick={() => setView("structure")}
          icon={<FolderTree className="h-3.5 w-3.5" />}
          label="Structure"
        />
        <TabButton
          active={view === "config"}
          onClick={() => setView("config")}
          icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          label="app.json"
        />
      </div>

      {/* Output */}
      <div className="max-h-[440px] overflow-auto px-4 py-4">
        {view === "structure" ? (
          <CodeBlock
            key="structure"
            code={stack.folderStructure}
            language="tree"
            showLineNumbers={false}
          />
        ) : (
          <CodeBlock key="config" code={appJson} language="json" />
        )}
      </div>
    </div>
  );
}

function CommandLine({
  prefix,
  packages,
}: {
  prefix: React.ReactNode;
  packages: string[];
}) {
  return (
    <div className="flex gap-2">
      <span className="select-none text-success">$</span>
      <code className="whitespace-pre-wrap break-words text-content">
        {prefix}{" "}
        {packages.map((name, i) => (
          <span key={name}>
            <span className="text-success">{name}</span>
            {i < packages.length - 1 ? " " : ""}
          </span>
        ))}
      </code>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors ${
        active
          ? "bg-surface text-content"
          : "text-content-subtle hover:text-content-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
