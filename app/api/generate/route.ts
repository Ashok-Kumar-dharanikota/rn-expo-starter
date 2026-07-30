import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT, aiConfig } from "@/lib/ai/config.js";

// Runs on the Node.js runtime so secrets stay server-side.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/generate  { prompt: string }
 *
 * Executes the Solution Architect agentic loop via Groq.
 * Returns full architectural blueprint JSON or { fallback: true } for local offline engine.
 */
export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ fallback: true, reason: "no-key" });
  }

  let prompt = "";
  try {
    const body = await req.json();
    prompt = String(body?.prompt ?? "").trim();
  } catch {
    /* ignore malformed body */
  }
  if (!prompt) {
    return NextResponse.json({ fallback: true, reason: "empty-prompt" });
  }

  try {
    const groq = new Groq({ apiKey });

    let messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ];

    let finalContent: string | null = null;
    let maxLoops = 3;

    // Preferred primary model with instant fallback model
    const primaryModel = process.env.GROQ_MODEL || aiConfig.model || "llama-3.3-70b-versatile";
    const fallbackModel = "llama-3.1-8b-instant";

    for (let i = 0; i < maxLoops; i++) {
      let completion;
      try {
        completion = await groq.chat.completions.create({
          model: primaryModel,
          temperature: aiConfig.temperature,
          response_format: { type: "json_object" },
          messages,
          tools: [
            {
              type: "function",
              function: {
                name: "verify_npm_package",
                description: "Check if an npm package exists and retrieve its latest description and peerDependencies.",
                parameters: {
                  type: "object",
                  properties: {
                    packageName: {
                      type: "string",
                      description: "The exact name of the npm package (e.g., 'expo-router', 'react-native-reanimated')",
                    },
                  },
                  required: ["packageName"],
                },
              },
            },
          ],
          tool_choice: "auto",
        });
      } catch (err) {
        console.warn(`[POST /api/generate] Primary model ${primaryModel} failed, retrying with ${fallbackModel}:`, err);
        completion = await groq.chat.completions.create({
          model: fallbackModel,
          temperature: aiConfig.temperature,
          response_format: { type: "json_object" },
          messages,
        });
      }

      const message = completion.choices[0]?.message;

      if (message?.tool_calls && message.tool_calls.length > 0) {
        messages.push(message);

        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name === "verify_npm_package") {
            let pkgName = "";
            try {
              const args = JSON.parse(toolCall.function.arguments);
              pkgName = args.packageName;
            } catch (e) {
              /* ignore parse error */
            }

            if (!pkgName) {
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify({ error: "Invalid packageName" }),
              });
              continue;
            }

            try {
              const res = await fetch(`https://registry.npmjs.org/${pkgName}/latest`);
              if (!res.ok) {
                messages.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: JSON.stringify({ error: `Package '${pkgName}' not found or error fetching.` }),
                });
              } else {
                const data = await res.json();
                messages.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: JSON.stringify({
                    name: data.name,
                    version: data.version,
                    description: data.description,
                    peerDependencies: data.peerDependencies || {},
                  }),
                });
              }
            } catch (err) {
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify({ error: "Network error checking npm registry." }),
              });
            }
          } else {
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: "Unknown tool" }),
            });
          }
        }
      } else {
        finalContent = message?.content || null;
        break; // Exit loop when model produces final content
      }
    }

    if (!finalContent) {
      return NextResponse.json({ fallback: true, reason: "empty-completion-or-loop-exceeded" });
    }
    return NextResponse.json(JSON.parse(finalContent));
  } catch (error) {
    console.error("[/api/generate] Groq error:", error);
    return NextResponse.json({ fallback: true, reason: "provider-error" });
  }
}
