import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-16 text-center sm:pt-24">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 text-[12.5px] text-content-muted animate-fade-in">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        Semantic stack generation for Expo
      </div>

      <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-content sm:text-[56px] animate-fade-in-up">
        Initialize your next universal app.{" "}
        <span className="text-content-muted">Semantically.</span>
      </h1>

      <p
        className="mx-auto mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-content-muted animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        Describe what you&rsquo;re building in plain language. The AI reads your
        requirements and selects the correct Expo ecosystem packages,
        architecture, and project structure — automatically.
      </p>
    </section>
  );
}
