import type {
  GeneratedStack,
  OutputView,
  PackageCategory,
  StackGroup,
  StackPackage,
} from "./types";

type Seed = Omit<StackPackage, "category">;

interface CapabilityRule {
  id: string;
  category: PackageCategory;
  keywords: RegExp;
  packages: Seed[];
  routes?: string[];
}

const p = (
  name: string,
  reason: string,
  installer: "expo" | "npm" = "expo",
  optional = false,
): Seed => ({
  name,
  reason,
  installer,
  optional,
  defaultSelected: !optional,
});

/** Always-present foundation. */
const CORE: StackGroup[] = [
  {
    category: "Routing",
    packages: [
      {
        category: "Routing",
        ...p(
          "expo-router",
          "File-based routing built for universal Expo apps, with typed routes and deep linking out of the box.",
        ),
      },
    ],
  },
  {
    category: "Styling",
    packages: [
      {
        category: "Styling",
        ...p(
          "nativewind",
          "Tailwind CSS for React Native — one styling language across iOS, Android, and web.",
          "npm",
        ),
      },
    ],
  },
  {
    category: "State",
    packages: [
      {
        category: "State",
        ...p(
          "@tanstack/react-query",
          "Server-state, caching, and background refetching without hand-rolled loading logic.",
          "npm",
        ),
      },
    ],
  },
];

const RULES: CapabilityRule[] = [
  {
    id: "auth",
    category: "Authentication",
    keywords:
      /\b(auth|login|sign[\s-]?in|sign[\s-]?up|biometric|face\s?id|touch\s?id|fingerprint|secure|account|password|credential|oauth|sso)\b/i,
    packages: [
      p(
        "expo-secure-store",
        "Encrypted key–value storage for session tokens, backed by Keychain / Keystore.",
      ),
      p(
        "expo-local-authentication",
        "Gates the app behind Face ID, Touch ID, or fingerprint for biometric login.",
      ),
      p(
        "expo-auth-session",
        "Alternative: hosted OAuth / OpenID Connect flows (Google, Apple, GitHub).",
        "expo",
        true,
      ),
    ],
    routes: ["app/(auth)/sign-in.tsx", "app/(auth)/sign-up.tsx"],
  },
  {
    id: "animations",
    category: "Animations",
    keywords:
      /\b(anim|animation|animated|gesture|swipe|drag|transition|interactive|smooth|fitness|workout|game|social|carousel|parallax)\b/i,
    packages: [
      p(
        "react-native-reanimated",
        "The performance standard for fluid, gesture-driven animations on the UI thread.",
      ),
      p(
        "react-native-gesture-handler",
        "Native-driven touch + gesture system that pairs with Reanimated.",
      ),
      p(
        "moti",
        "Alternative: a declarative animation layer on top of Reanimated for simpler transitions.",
        "npm",
        true,
      ),
      p(
        "lottie-react-native",
        "Alternative: render After Effects / Lottie vector animations.",
        "expo",
        true,
      ),
      p(
        "expo-haptics",
        "Tactile feedback for key interactions — subtle polish on primary flows.",
        "expo",
        true,
      ),
    ],
  },
  {
    id: "location",
    category: "Location & Maps",
    keywords:
      /\b(map|maps|location|gps|geo|nearby|route|navigation|directions|delivery|ride|driver|track(ing)?\s?(location|route|run))\b/i,
    packages: [
      p(
        "expo-location",
        "Foreground and background geolocation with permission handling for live tracking.",
      ),
      p(
        "react-native-maps",
        "Native map rendering with markers, polylines, and real-time camera updates.",
      ),
      p(
        "expo-task-manager",
        "Alternative: background location tasks that keep tracking when the app is closed.",
        "expo",
        true,
      ),
    ],
    routes: ["app/(tabs)/map.tsx"],
  },
  {
    id: "notifications",
    category: "Notifications",
    keywords:
      /\b(notification|notifications|push|alert|remind(er|ers)?|reengage|re-engage|inbox)\b/i,
    packages: [
      p(
        "expo-notifications",
        "Push and local notifications with scheduling, handlers, and permission prompts.",
      ),
      p(
        "expo-device",
        "Reads device metadata required to register a push token.",
      ),
      p(
        "@notifee/react-native",
        "Alternative: rich, fully-customizable local notifications with channels and actions.",
        "npm",
        true,
      ),
    ],
    routes: ["app/(tabs)/inbox.tsx"],
  },
  {
    id: "camera",
    category: "Media",
    keywords:
      /\b(camera|scan|scanner|qr|barcode|selfie|document\s?scan|capture)\b/i,
    packages: [
      p(
        "expo-camera",
        "Camera capture with barcode / QR scanning and fine-grained permissions.",
      ),
    ],
    routes: ["app/(tabs)/scan.tsx"],
  },
  {
    id: "media",
    category: "Media",
    keywords:
      /\b(image|images|gallery|photo|media|upload|avatar|thumbnail|picture|video|feed|story|stories)\b/i,
    packages: [
      p(
        "expo-image",
        "High-performance image component with caching, blurhash placeholders, and transitions.",
      ),
      p(
        "expo-image-picker",
        "Lets users pick or capture photos and videos from the library or camera.",
      ),
      p(
        "expo-video",
        "Alternative: modern video playback replacing the legacy expo-av Video API.",
        "expo",
        true,
      ),
    ],
  },
  {
    id: "offline",
    category: "Data & Sync",
    keywords:
      /\b(offline|sync|local\s?db|database|persist|cache|sqlite|store\s?locally|works?\s?offline)\b/i,
    packages: [
      p(
        "expo-sqlite",
        "On-device SQL database powering offline-first reads and a sync queue.",
      ),
      p(
        "@react-native-async-storage/async-storage",
        "Lightweight persistence for query-cache hydration and preferences.",
        "npm",
      ),
      p(
        "drizzle-orm",
        "Alternative: a typed SQL query builder over expo-sqlite with migrations.",
        "npm",
        true,
      ),
    ],
  },
  {
    id: "realtime",
    category: "Data & Sync",
    keywords:
      /\b(real[\s-]?time|live|chat|messaging|socket|presence|multiplayer|collaborat)\b/i,
    packages: [
      p(
        "@supabase/supabase-js",
        "Realtime subscriptions and a hosted Postgres backend for live data and chat.",
        "npm",
      ),
    ],
  },
  {
    id: "payments",
    category: "Payments",
    keywords:
      /\b(payment|payments|checkout|subscription|billing|stripe|pay|wallet|purchase|order|cart|ecommerce|e-commerce)\b/i,
    packages: [
      p(
        "@stripe/stripe-react-native",
        "PCI-compliant payment sheet with Apple Pay and Google Pay support.",
      ),
      p(
        "react-native-iap",
        "Alternative: native in-app purchases and subscriptions via the App / Play stores.",
        "npm",
        true,
      ),
    ],
    routes: ["app/(tabs)/checkout.tsx"],
  },
  {
    id: "ai",
    category: "AI",
    keywords:
      /\b(ai|ml|recommend(ation|ations)?|assistant|chatbot|chat\s?bot|gpt|llm|smart|intelligent|personaliz)/i,
    packages: [
      p(
        "ai",
        "Vercel AI SDK for streaming model responses and building assistant flows.",
        "npm",
      ),
      p(
        "openai",
        "Alternative: the official OpenAI client for direct API access.",
        "npm",
        true,
      ),
    ],
    routes: ["app/(tabs)/assistant.tsx"],
  },
];

/** app.json config-plugin entries contributed by a package. */
const PLUGIN_CONFIG: Record<
  string,
  string | [string, Record<string, unknown>]
> = {
  "expo-router": "expo-router",
  "expo-secure-store": "expo-secure-store",
  "expo-notifications": "expo-notifications",
  "react-native-reanimated": "react-native-reanimated",
  "@stripe/stripe-react-native": "@stripe/stripe-react-native",
  "expo-location": [
    "expo-location",
    {
      locationAlwaysAndWhenInUsePermission:
        "Allow $(PRODUCT_NAME) to use your location.",
    },
  ],
  "expo-camera": [
    "expo-camera",
    { cameraPermission: "Allow $(PRODUCT_NAME) to access your camera." },
  ],
  "expo-image-picker": [
    "expo-image-picker",
    { photosPermission: "Allow $(PRODUCT_NAME) to access your photos." },
  ],
  "expo-video": "expo-video",
};

const STOP_WORDS = new Set([
  "a", "an", "the", "with", "and", "for", "app", "application", "that",
  "which", "featuring", "including", "using", "of", "to", "my", "our",
]);

function deriveNames(prompt: string): { displayName: string; appName: string } {
  const cleaned = prompt.trim().replace(/\s+/g, " ");
  const match = cleaned.match(/([a-z0-9][a-z0-9\s-]{1,40}?)\s+app\b/i);
  const base = match ? match[1] : cleaned;

  const words = base
    .split(/[\s,]+/)
    .map((w) => w.replace(/[^a-zA-Z0-9-]/g, ""))
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w.toLowerCase()))
    .slice(0, 3);

  if (words.length === 0) words.push("Universal");

  const displayName =
    words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ") + " App";
  const appName =
    words.map((w) => w.toLowerCase()).join("-").replace(/-+/g, "-") + "-app";

  return { displayName, appName };
}

function mergeGroups(groups: StackGroup[]): StackGroup[] {
  const order: PackageCategory[] = [];
  const map = new Map<PackageCategory, StackPackage[]>();
  const seen = new Set<string>();

  for (const group of groups) {
    if (!map.has(group.category)) {
      map.set(group.category, []);
      order.push(group.category);
    }
    const bucket = map.get(group.category)!;
    for (const pkg of group.packages) {
      if (!seen.has(pkg.name)) {
        seen.add(pkg.name);
        bucket.push(pkg);
      }
    }
  }
  return order.map((category) => ({ category, packages: map.get(category)! }));
}

function categoryRoute(category: PackageCategory): string | null {
  switch (category) {
    case "Location & Maps":
      return "map.tsx";
    case "Media":
      return "media.tsx";
    case "Notifications":
      return "inbox.tsx";
    case "Payments":
      return "checkout.tsx";
    case "AI":
      return "assistant.tsx";
    default:
      return null;
  }
}

function buildFolderStructure(
  appName: string,
  groups: StackGroup[],
): string {
  const hasAuth = groups.some((g) => g.category === "Authentication");
  const tabScreens = groups
    .map((g) => categoryRoute(g.category))
    .filter((r): r is string => r !== null);
  const hasTabs = tabScreens.length > 0;

  const lines: string[] = [];
  lines.push(`${appName}/`);
  lines.push(`├─ app/`);
  lines.push(`│  ├─ _layout.tsx`);
  if (hasAuth) {
    lines.push(`│  ├─ (auth)/`);
    lines.push(`│  │  ├─ _layout.tsx`);
    lines.push(`│  │  ├─ sign-in.tsx`);
    lines.push(`│  │  └─ sign-up.tsx`);
  }
  if (hasTabs) {
    lines.push(`│  ├─ (tabs)/`);
    lines.push(`│  │  ├─ _layout.tsx`);
    lines.push(`│  │  ├─ index.tsx`);
    tabScreens.forEach((screen) => lines.push(`│  │  ├─ ${screen}`));
    lines.push(`│  │  └─ profile.tsx`);
  } else {
    lines.push(`│  ├─ index.tsx`);
  }
  lines.push(`│  └─ +not-found.tsx`);
  lines.push(`├─ components/`);
  lines.push(`│  ├─ ui/`);
  lines.push(`│  └─ providers.tsx`);
  lines.push(`├─ lib/`);
  lines.push(`│  ├─ api.ts`);
  lines.push(`│  └─ query-client.ts`);
  lines.push(`├─ assets/`);
  lines.push(`├─ app.json`);
  lines.push(`├─ tailwind.config.js`);
  lines.push(`└─ package.json`);
  return lines.join("\n");
}

/** Build the two install commands from a set of selected packages. */
export function buildCommands(selected: StackPackage[]): {
  expo: string | null;
  npm: string | null;
} {
  const expoPkgs = selected
    .filter((s) => s.installer === "expo")
    .map((s) => s.name);
  const npmPkgs = selected
    .filter((s) => s.installer === "npm")
    .map((s) => s.name);
  return {
    expo: expoPkgs.length ? `npx expo install ${expoPkgs.join(" ")}` : null,
    npm: npmPkgs.length ? `npm install ${npmPkgs.join(" ")}` : null,
  };
}

/** Build app.json reflecting the currently selected packages. */
export function buildAppJson(
  appName: string,
  displayName: string,
  selected: StackPackage[],
): string {
  const bundleId = `ai.expoinit.${appName.replace(/-/g, "")}`;
  const plugins: (string | [string, Record<string, unknown>])[] = [];
  const pushPlugin = (entry: string | [string, Record<string, unknown>]) => {
    const key = Array.isArray(entry) ? entry[0] : entry;
    if (!plugins.some((e) => (Array.isArray(e) ? e[0] : e) === key)) {
      plugins.push(entry);
    }
  };
  pushPlugin("expo-router");
  for (const pkg of selected) {
    const cfg = PLUGIN_CONFIG[pkg.name];
    if (cfg) pushPlugin(cfg);
  }

  const config = {
    expo: {
      name: displayName,
      slug: appName,
      version: "1.0.0",
      orientation: "portrait",
      scheme: appName.replace(/-/g, ""),
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: { supportsTablet: true, bundleIdentifier: bundleId },
      android: { package: bundleId },
      web: { bundler: "metro", output: "static" },
      plugins,
      experiments: { typedRoutes: true },
    },
  };
  return JSON.stringify(config, null, 2);
}

/** Flatten groups into a package list. */
export function flattenPackages(groups: StackGroup[]): StackPackage[] {
  return groups.flatMap((g) => g.packages);
}

const DEFAULT_PROMPT =
  "A food delivery app with user login, live order tracking on maps, push notifications, and secure in-app payments.";

/** Deterministic local generation — the default, backend-free path. */
export function generateStack(rawPrompt: string): GeneratedStack {
  const prompt = rawPrompt.trim().length > 0 ? rawPrompt.trim() : DEFAULT_PROMPT;
  const matched = RULES.filter((rule) => rule.keywords.test(prompt));

  const groups = mergeGroups([
    ...CORE,
    ...matched.map((rule) => ({
      category: rule.category,
      packages: rule.packages.map((seed) => ({
        ...seed,
        category: rule.category,
      })),
    })),
  ]);

  const { displayName, appName } = deriveNames(prompt);
  const featureCats = matched.map((r) => r.category);
  const uniqueCats = Array.from(new Set(featureCats));

  const summary =
    uniqueCats.length > 0
      ? `Detected ${uniqueCats.length} capability ${
          uniqueCats.length === 1 ? "domain" : "domains"
        }: ${uniqueCats.join(", ")}.`
      : "Baseline universal setup with the Expo core.";

  const defaultView: OutputView = matched.length > 0 ? "structure" : "config";

  return {
    appName,
    displayName,
    summary,
    groups,
    folderStructure: buildFolderStructure(appName, groups),
    appJson: buildAppJson(
      appName,
      displayName,
      flattenPackages(groups).filter((pkg) => pkg.defaultSelected),
    ),
    defaultView,
    source: "local",
  };
}

export const EXAMPLE_PROMPTS: string[] = [
  "A fitness tracking app with biometric login, offline sync, real-time maps, and AI workout recommendations.",
  "A social photo app with camera capture, an image feed, animations, and push notifications.",
  "A marketplace app with secure payments, live chat, and location-based search.",
];

export const DEFAULT_PLACEHOLDER =
  "A fitness tracking app with biometric login, offline sync, real-time maps, and AI workout recommendations.";
