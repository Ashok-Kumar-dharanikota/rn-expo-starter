"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PromptWorkspace } from "@/components/PromptWorkspace";
import { LoadingTerminal } from "@/components/LoadingTerminal";
import { GeneratedResult } from "@/components/GeneratedResult";
import { Footer } from "@/components/Footer";
import { WireframeBackground } from "@/components/WireframeBackground";
import { generateStackSmart } from "@/lib/ai/generate";
import { useHaptics } from "@/lib/useHaptics";
import type { GeneratedStack } from "@/lib/types";

type Phase = "idle" | "loading" | "result";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [prompt, setPrompt] = useState("");
  const [stack, setStack] = useState<GeneratedStack | null>(null);
  const [loadingDone, setLoadingDone] = useState(false);
  const { trigger } = useHaptics();

  const handleGenerate = useCallback(() => {
    setStack(null);
    setLoadingDone(false);
    setPhase("loading");
    // Kick off generation in parallel with the loading animation.
    generateStackSmart(prompt)
      .then(setStack)
      .catch(() => setStack(null));
  }, [prompt]);

  // Advance to results only once BOTH the animation and generation finish.
  useEffect(() => {
    if (phase === "loading" && loadingDone && stack) {
      setPhase("result");
      trigger("success");
    }
  }, [phase, loadingDone, stack, trigger]);

  const handleReset = useCallback(() => {
    setPhase("idle");
    setStack(null);
    setLoadingDone(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Ambient layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-grid mask-fade-b"
      />
      {phase !== "result" && <WireframeBackground />}

      <div className="relative">
        <Header />

        <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-6">
          {phase !== "result" && (
            <>
              <Hero />
              {phase === "idle" && (
                <PromptWorkspace
                  value={prompt}
                  onChange={setPrompt}
                  onGenerate={handleGenerate}
                />
              )}
              {phase === "loading" && (
                <LoadingTerminal onComplete={() => setLoadingDone(true)} />
              )}
            </>
          )}

          {phase === "result" && stack && (
            <GeneratedResult stack={stack} onReset={handleReset} />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
