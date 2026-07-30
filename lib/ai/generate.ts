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
  const local = generateStack(prompt); // reused for structure + fallback defaults

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

  const appName = String(raw?.appName ?? raw?.application?.slug ?? local.appName);
  const displayName = String(raw?.displayName ?? raw?.application?.name ?? local.displayName);

  return {
    appName,
    displayName,
    summary: String(raw?.summary ?? raw?.application?.summary ?? local.summary),
    category: raw?.category ?? raw?.application?.category ?? local.category,
    archetype: raw?.archetype ?? raw?.application?.archetype ?? local.archetype,
    groups,
    folderStructure: raw?.folderStructure ? (typeof raw.folderStructure === "string" ? raw.folderStructure : local.folderStructure) : local.folderStructure,
    appJson: raw?.appJson ? (typeof raw.appJson === "string" ? raw.appJson : local.appJson) : local.appJson,
    defaultView: local.defaultView,
    source: "ai",

    // Extended Architecture Dashboard fields
    executiveSummary: raw?.executiveSummary ?? local.executiveSummary,
    detectedFeatures: raw?.detectedFeatures ?? raw?.features?.detected ?? local.detectedFeatures,
    inferredFeatures: raw?.inferredFeatures ?? raw?.features?.inferred ?? local.inferredFeatures,
    architectureDecisions: raw?.architectureDecisions ?? raw?.architecture ?? local.architectureDecisions,
    rationales: raw?.rationales ?? local.rationales,
    cloudServices: raw?.cloudServices ?? raw?.backendServices?.services ?? local.cloudServices,
    environmentVariables: raw?.environmentVariables ?? local.environmentVariables,
    permissions: raw?.permissions ?? local.permissions,
    roadmap: raw?.roadmap ?? local.roadmap,
    evaluation: raw?.evaluation ?? local.evaluation,
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
