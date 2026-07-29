import type {
  GeneratedStack,
  StackGroup,
  StackPackage,
  PackageCategory,
} from "@/lib/types";
import { generateStack, flattenPackages } from "@/lib/generateStack";
import { aiConfig, SYSTEM_PROMPT } from "./config.js";

const OPENAI_KEY_STORAGE = "expo-init-ai:openai-key";

function resolveApiKey(): string {
  if (aiConfig.apiKey) return aiConfig.apiKey;
  try {
    return window.localStorage.getItem(OPENAI_KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

/** Coerce a raw AI JSON payload into a fully-formed GeneratedStack. */
function normalize(raw: any, prompt: string): GeneratedStack {
  const local = generateStack(prompt); // reused for structure + app.json helpers

  const groups: StackGroup[] = Array.isArray(raw?.groups)
    ? raw.groups.map((g: any) => ({
        category: (g.category ?? "Core") as PackageCategory,
        packages: (Array.isArray(g.packages) ? g.packages : []).map(
          (pkg: any): StackPackage => ({
            name: String(pkg.name ?? "").trim(),
            category: (g.category ?? "Core") as PackageCategory,
            reason: String(pkg.reason ?? ""),
            installer: pkg.installer === "npm" ? "npm" : "expo",
            optional: Boolean(pkg.optional),
            defaultSelected:
              pkg.defaultSelected ?? !Boolean(pkg.optional),
          }),
        ),
      }))
    : local.groups;

  const appName = String(raw?.appName ?? local.appName);
  const displayName = String(raw?.displayName ?? local.displayName);

  return {
    appName,
    displayName,
    summary: String(raw?.summary ?? local.summary),
    groups,
    // Reuse local scaffolding for the tree + app.json so output stays coherent.
    folderStructure: local.folderStructure,
    appJson: local.appJson,
    defaultView: local.defaultView,
    source: "ai",
  };
}

async function withTimeout<T>(pr: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    pr,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);
}

async function callProvider(prompt: string): Promise<GeneratedStack | null> {
  // 1) Server route takes priority (keeps secrets server-side, e.g. Groq).
  if (aiConfig.endpoint) {
    const res = await withTimeout(
      fetch(aiConfig.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }),
      aiConfig.timeoutMs,
    );
    if (!res.ok) throw new Error(`endpoint ${res.status}`);
    const payload = await res.json();
    // The route signals "no key / failed" by returning { fallback: true }.
    if (payload?.fallback) return null;
    return normalize(payload, prompt);
  }

  // 2) Direct OpenAI-compatible chat completion.
  const key = resolveApiKey();
  if (!key) return null;

  const res = await withTimeout(
    fetch(`${aiConfig.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: aiConfig.model,
        temperature: aiConfig.temperature,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      }),
    }),
    aiConfig.timeoutMs,
  );
  if (!res.ok) throw new Error(`provider ${res.status}`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;
  return normalize(JSON.parse(content), prompt);
}

/**
 * Public entry point used by the UI. Uses a live model when configured,
 * and always falls back to the deterministic local generator.
 */
export async function generateStackSmart(
  prompt: string,
): Promise<GeneratedStack> {
  if (aiConfig.enabled) {
    try {
      const result = await callProvider(prompt);
      if (result && flattenPackages(result.groups).length > 0) {
        return result;
      }
    } catch (err) {
      console.error("[generateStackSmart] AI generation failed, falling back to local:", err);
    }
  }
  return generateStack(prompt);
}
