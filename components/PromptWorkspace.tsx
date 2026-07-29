"use client";

import { ArrowRight, CornerDownLeft, Wand2 } from "lucide-react";
import { DEFAULT_PLACEHOLDER, EXAMPLE_PROMPTS } from "@/lib/generateStack";
import { useHaptics } from "@/lib/useHaptics";

interface PromptWorkspaceProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export function PromptWorkspace({
  value,
  onChange,
  onGenerate,
  disabled,
}: PromptWorkspaceProps) {
  const { trigger } = useHaptics();
  const lineCount = Math.max(value.split("\n").length, 3);

  const fireGenerate = () => {
    trigger("medium");
    onGenerate();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      fireGenerate();
    }
  };

  return (
    <section
      className="mx-auto mt-10 max-w-3xl animate-fade-in-up"
      style={{ animationDelay: "160ms" }}
    >
      <div className="group relative rounded-lg border border-line bg-surface shadow-panel transition-colors duration-300 focus-within:border-accent/50 focus-within:shadow-glow-soft">
        {/* Editor chrome */}
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            </div>
            <span className="ml-2 font-mono text-[12px] text-content-subtle">
              idea.prompt
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11.5px] text-content-faint">
            <Wand2 className="h-3.5 w-3.5" />
            natural language
          </div>
        </div>

        {/* Editor body with a line-number gutter */}
        <div className="flex">
          <div
            aria-hidden
            className="select-none py-4 pl-4 pr-3 text-right font-mono text-[13px] leading-[1.7] text-content-faint"
          >
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={DEFAULT_PLACEHOLDER}
            spellCheck={false}
            rows={lineCount}
            aria-label="Describe your app idea"
            className="min-h-[112px] w-full resize-none bg-transparent py-4 pr-4 font-mono text-[13.5px] leading-[1.7] text-content caret-accent placeholder:text-content-faint focus:outline-none"
          />
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between border-t border-line px-4 py-3">
          <span className="hidden items-center gap-1.5 text-[12px] text-content-subtle sm:flex">
            <kbd className="rounded border border-line bg-canvas-raised px-1.5 py-0.5 font-mono text-[11px]">
              ⌘
            </kbd>
            <kbd className="flex items-center rounded border border-line bg-canvas-raised px-1.5 py-0.5 font-mono text-[11px]">
              <CornerDownLeft className="h-3 w-3" />
            </kbd>
            to generate
          </span>
          <button
            onClick={fireGenerate}
            disabled={disabled}
            className="ml-auto flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13.5px] font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Generate Stack
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Example prompts */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[12.5px] text-content-subtle">Try:</span>
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example}
            onClick={() => onChange(example)}
            disabled={disabled}
            className="max-w-[240px] truncate rounded-full border border-line bg-surface/60 px-3 py-1 text-[12px] text-content-muted transition-colors hover:border-line-strong hover:text-content disabled:opacity-50"
            title={example}
          >
            {example.replace(/^A(n)? /, "").split(" with ")[0]}
          </button>
        ))}
      </div>
    </section>
  );
}
