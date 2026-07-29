/**
 * ─────────────────────────────────────────────────────────────
 *  AI CREDENTIALS & PROVIDER CONFIG
 * ─────────────────────────────────────────────────────────────
 *  Drop your own AI credentials here to switch the app from the
 *  built-in local generator to a live model. Everything works
 *  out of the box with `enabled: false` — no key required.
 *
 *  SECURITY NOTE
 *  This file ships to the browser. For a real production launch,
 *  do NOT hardcode a secret key here. Instead either:
 *    1) leave `apiKey` empty and let users paste their own key in
 *       Settings (stored only in their browser), or
 *    2) set `endpoint` to your own backend route that holds the
 *       secret server-side and returns the stack JSON.
 * ─────────────────────────────────────────────────────────────
 */

export const aiConfig = {
  /**
   * Master switch. Live generation runs through the secure server route
   * (`/api/generate`, powered by Groq). It safely falls back to the local
   * generator whenever a key is missing or a request fails, so this can
   * stay `true` even before you add credentials.
   *
   *  ── To activate Groq ──
   *  1) npm install groq-sdk   (already in package.json)
   *  2) create .env.local with:  GROQ_API_KEY=your_key_here
   *  3) restart the dev server. Done.
   */
  enabled: true,

  /** "groq" | "openai" | "anthropic" | "custom" */
  provider: "groq",

  /**
   * Direct browser API key (OPTIONAL, not recommended for production).
   * Leave blank to use the server route below, or the key a user pastes
   * in Settings. Prefer the `endpoint` option so secrets stay server-side.
   */
  apiKey: "",

  /** Model identifier for the chosen provider. */
  model: "llama-3.1-8b-instant",

  /** Base URL for a direct browser call (used only if `endpoint` is empty). */
  baseUrl: "https://api.groq.com/openai/v1",

  /**
   * Server route that holds the secret key and returns GeneratedStack JSON.
   * This takes priority over provider/apiKey and keeps the key off the client.
   */
  endpoint: "/api/generate",

  /** Sampling temperature for the model. */
  temperature: 0.2,

  /** Hard timeout for a live request before falling back to local. */
  timeoutMs: 20000,
};

export const SYSTEM_PROMPT = `You are an expert Expo / React Native architect.
Given an app idea, return ONLY valid JSON (no markdown, no comments) describing the ideal Expo stack.

Shape of the JSON:
{
  "displayName": string,
  "appName": string (kebab-case),
  "summary": string,
  "groups": [
    {
      "category": string,
      "packages": [
        {
          "name": string,
          "reason": string,
          "installer": "expo" | "npm",
          "optional": boolean,
          "defaultSelected": boolean
        }
      ]
    }
  ]
}

Example valid JSON output:
{
  "displayName": "Food Delivery App",
  "appName": "food-delivery-app",
  "summary": "A comprehensive food delivery app featuring robust authentication, real-time maps, and secure payments.",
  "groups": [
    {
      "category": "Authentication",
      "packages": [
        {
          "name": "expo-local-authentication",
          "reason": "Allows biometric login for quicker, secure access.",
          "installer": "expo",
          "optional": false,
          "defaultSelected": true
        }
      ]
    },
    {
      "category": "Location & Maps",
      "packages": [
        {
          "name": "react-native-maps",
          "reason": "Native map rendering for live order tracking.",
          "installer": "npm",
          "optional": false,
          "defaultSelected": true
        }
      ]
    }
  ]
}

Prefer first-party Expo packages. Include alternatives as optional packages within a category.

IMPORTANT: You have access to a \`verify_npm_package\` tool. If you are suggesting complex packages or are unsure of their exact name or required peer dependencies (like 'react-native-reanimated' or 'expo-camera'), you MUST use this tool to query the NPM registry before answering. Ensure any required peerDependencies discovered are included in your final JSON output.`;
