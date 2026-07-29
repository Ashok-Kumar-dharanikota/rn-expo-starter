# Expo Init AI

A premium, single-page developer tool that turns a natural-language app idea into
the ideal **Expo / React Native** stack — recommended packages grouped by
capability, a live `npx expo install` command you can toggle, project structure,
and an `app.json`.

Built to feel like an official Expo product: neutral, spacious, and
developer-focused, following Expo's monochrome brand language with a single
indigo accent.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** with a token-based design system (light + dark)
- **groq-sdk** for optional live AI generation (server route)
- **lucide-react** icons · Inter + JetBrains Mono via `next/font`

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Features

- **Light / dark themes** — toggle in the header, persisted in `localStorage`,
  with a no-flash inline init script. Every color is a CSS variable.
- **Animated wireframe background** — drifting app mockups behind the hero
  (disabled automatically under `prefers-reduced-motion`).
- **Grouped, toggleable stack** — packages are organized by capability
  (Authentication, Animations, Notifications, …). Each has a circular
  include/exclude toggle; alternatives (e.g. `@notifee/react-native` vs
  `expo-notifications`) are off by default. The terminal's install command and
  `app.json` recompute live from your selection.
- **Haptic feedback** — subtle Web Vibration API feedback on key actions, with
  an accessibility toggle in Settings (reduced-motion aware).
- **Intelligent terminal loading** — a simulated shell session, then a smooth
  transition to results with no page refresh.

## AI generation (Groq)

Generation is **local-first** and works with zero setup. To switch on live
generation with Groq:

1. `npm install groq-sdk` (already in `package.json`)
2. Copy `.env.local.example` → `.env.local` and set `GROQ_API_KEY`
3. Restart the dev server

How it flows: the client calls the server route **`app/api/generate/route.ts`**,
which runs Groq (`llama-3.1-8b-instant` by default) with the key kept
server-side. If no key is set or the call fails, it returns `{ fallback: true }`
and the client transparently uses the local generator — so nothing ever breaks.

Provider settings live in **`lib/ai/config.js`** (model, temperature, endpoint,
system prompt). Update that file to change models or point at a different
OpenAI-compatible provider.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Structure

```
app/
  layout.tsx            Fonts, metadata, no-FOUC theme script
  page.tsx              Idle → loading → result state machine
  globals.css           Light/dark tokens, grid, reduced-motion
  api/generate/route.ts Groq server route (secret stays server-side)
components/              Header, Hero, PromptWorkspace, LoadingTerminal,
                         GeneratedResult, StackGroup, TerminalPanel, …
lib/
  generateStack.ts       Rule-based grouped generator + command builders
  types.ts               Shared types
  useTheme / useHaptics / useApiKey   Client hooks
  ai/config.js           AI credentials + provider config (edit me)
  ai/generate.ts         Smart generation with local fallback
```

Not affiliated with or endorsed by Expo / 650 Industries.
