import type {
  GeneratedStack,
  OutputView,
  PackageCategory,
  PackageTier,
  StackGroup,
  StackPackage,
  DetectedFeature,
  InferredFeature,
  ArchitectureDecisionsData,
  CloudService,
  EnvironmentVariableItem,
  PermissionItem,
  RoadmapPhaseItem,
  ArchitectureEvaluationData,
  ExecutiveSummaryData,
} from "./types";
import { PRINCIPAL_ENGINEER_KNOWLEDGE_BASE } from "./ai/knowledgeBase";
import { ARCHITECTURAL_RATIONALES } from "./ai/architecturalRationales";
import { RECOMMENDED_CLOUD_SERVICES_MATRIX } from "./ai/cloudServicesMatrix";

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
  purpose: string,
  reason: string,
  tier: "Essential" | "Recommended" | "Optional" = "Essential",
  installer: "expo" | "npm" = "expo",
  optional = false,
  configNeeded = "",
  hasConfigPlugin = false,
  alternatives: string[] = [],
  docUrl = "https://docs.expo.dev/versions/latest/sdk/overview/"
): Seed => ({
  name,
  purpose,
  reason,
  tier,
  installer,
  optional,
  defaultSelected: !optional,
  expoCompatibility: "Expo SDK 52+ Compatible",
  configNeeded,
  hasConfigPlugin,
  alternatives,
  docUrl,
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
          "File-Based App Router",
          "Official Expo file-based router enabling universal deep linking, typed routes, and React Native Server Component readiness.",
          "Essential",
          "expo",
          false,
          "app.json plugin: 'expo-router'",
          true,
          ["React Navigation v6"],
          "https://docs.expo.dev/router/introduction/"
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
          "Universal Tailwind CSS Engine",
          "Brings Tailwind CSS to React Native for consistent cross-platform styling across iOS, Android, and Web.",
          "Essential",
          "npm",
          false,
          "tailwind.config.js & babel plugin",
          false,
          ["Unistyles", "Tamagui", "StyleSheet"],
          "https://www.nativewind.dev/"
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
          "Async Server-State Manager",
          "Eliminates hand-rolled loading/error state with automatic query caching, background polling, and optimistic mutation queues.",
          "Essential",
          "npm",
          false,
          "QueryClientProvider wrapper",
          false,
          ["SWR", "Redux Toolkit"],
          "https://tanstack.com/query/latest"
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
        "Encrypted Vault Storage",
        "Hardware-backed encryption for session tokens, JWTs, and secret keys using iOS Keychain and Android Keystore.",
        "Essential",
        "expo",
        false,
        "app.json plugin: 'expo-secure-store'",
        true,
        ["AsyncStorage"],
        "https://docs.expo.dev/versions/latest/sdk/securestore/"
      ),
      p(
        "expo-local-authentication",
        "Biometric Security Wall",
        "Enables Face ID, Touch ID, and fingerprint authentication guards for sensitive user actions.",
        "Recommended",
        "expo",
        false,
        "iOS NSFaceIDUsageDescription permission string",
        true,
        ["Passcodes"],
        "https://docs.expo.dev/versions/latest/sdk/local-authentication/"
      ),
      p(
        "expo-auth-session",
        "OAuth 2.0 PKCE Session Engine",
        "Handles OAuth 2.0 and OpenID Connect browser redirects for Google, Apple, and GitHub logins.",
        "Optional",
        "expo",
        true,
        "Deep link scheme in app.json",
        true,
        ["Clerk", "Auth0"],
        "https://docs.expo.dev/versions/latest/sdk/auth-session/"
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
        "UI-Thread Animation Driver",
        "The industry standard for 60fps gesture-driven animations running natively on the UI thread.",
        "Recommended",
        "npm",
        false,
        "Babel plugin & app.json plugin",
        true,
        ["Animated API"],
        "https://docs.swmansion.com/react-native-reanimated/"
      ),
      p(
        "react-native-gesture-handler",
        "Native Touch System",
        "Provides native touch gesture recognizers that pair seamlessly with Reanimated.",
        "Recommended",
        "npm",
        false,
        "GestureHandlerRootView wrapper",
        true,
        ["PanResponder"],
        "https://docs.swmansion.com/react-native-gesture-handler/"
      ),
      p(
        "expo-haptics",
        "Tactile Haptic Feedback",
        "Triggers subtle hardware haptic vibrations on key user interactions for enhanced sensory feedback.",
        "Optional",
        "expo",
        true,
        "Zero native config",
        false,
        [],
        "https://docs.expo.dev/versions/latest/sdk/haptics/"
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
        "Geolocation Telemetry Engine",
        "Handles foreground/background GPS location sampling with native permission prompts.",
        "Essential",
        "expo",
        false,
        "app.json plugin with location permission strings",
        true,
        ["react-native-geolocation-service"],
        "https://docs.expo.dev/versions/latest/sdk/location/"
      ),
      p(
        "react-native-maps",
        "Native Map Renderer",
        "Renders Apple Maps on iOS and Google Maps on Android with markers, polylines, and camera controls.",
        "Recommended",
        "npm",
        false,
        "Google Maps API Key in app.json",
        true,
        ["Mapbox GL"],
        "https://github.com/react-native-maps/react-native-maps"
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
        "Push & Local Notification Manager",
        "Schedules local alerts and manages Expo / APNs / FCM push notification registration tokens.",
        "Essential",
        "expo",
        false,
        "app.json plugin & notification icon assets",
        true,
        ["OneSignal", "Notifee"],
        "https://docs.expo.dev/versions/latest/sdk/notifications/"
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
        "Native Camera & Barcode Scanner",
        "High-performance camera view supporting photo capture, video recording, and barcode/QR scanning.",
        "Essential",
        "expo",
        false,
        "app.json camera & microphone permission strings",
        true,
        ["react-native-vision-camera"],
        "https://docs.expo.dev/versions/latest/sdk/camera/"
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
        "High-Performance Image Component",
        "Optimized image viewer with disk caching, Blurhash placeholders, and cross-fade transition effects.",
        "Essential",
        "expo",
        false,
        "Zero extra config",
        false,
        ["react-native-fast-image"],
        "https://docs.expo.dev/versions/latest/sdk/image/"
      ),
      p(
        "expo-image-picker",
        "Media Library & Camera Picker",
        "Provides native photo picker sheets for selecting images and videos from the system photo library.",
        "Recommended",
        "expo",
        false,
        "app.json photo library permission strings",
        true,
        [],
        "https://docs.expo.dev/versions/latest/sdk/image-picker/"
      ),
      p(
        "expo-video",
        "Modern Video Playback Engine",
        "SDK 52+ video player separating player lifecycle logic from UI VideoView components.",
        "Optional",
        "expo",
        true,
        "app.json plugin: 'expo-video'",
        true,
        ["react-native-video"],
        "https://docs.expo.dev/versions/latest/sdk/video/"
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
        "op-sqlite",
        "High-Speed Embedded SQLite Engine",
        "Ultra-fast local SQL database operating via C++ JSI bindings for offline-first reads and mutation queues.",
        "Essential",
        "npm",
        false,
        "Custom Dev Client build required",
        false,
        ["expo-sqlite", "WatermelonDB"],
        "https://github.com/OP-Engineering/op-sqlite"
      ),
      p(
        "react-native-mmkv",
        "Ultra-Fast Key-Value Storage",
        "30x faster than AsyncStorage for persisting query cache state, active sessions, and user settings.",
        "Recommended",
        "npm",
        false,
        "Custom Dev Client build required",
        false,
        ["AsyncStorage"],
        "https://github.com/mrousavy/react-native-mmkv"
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
        "Realtime Postgres & Auth Client",
        "Managed Postgres database client with WebSocket realtime subscriptions, Row Level Security, and Auth.",
        "Essential",
        "npm",
        false,
        "EXPO_PUBLIC_SUPABASE_URL env key",
        false,
        ["Firebase", "Convex"],
        "https://supabase.com/docs/reference/javascript/introduction"
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
        "PCI-Compliant Stripe SDK",
        "Native payment sheet interface supporting Apple Pay, Google Pay, and credit card processing.",
        "Essential",
        "npm",
        false,
        "app.json plugin & merchantIdentifier",
        true,
        ["RevenueCat", "react-native-iap"],
        "https://stripe.com/docs/stripe-react-native"
      ),
    ],
    routes: ["app/(tabs)/checkout.tsx"],
  },
  {
    id: "ai",
    category: "AI",
    keywords:
      /\b(ai|ml|recommend(ation|ations)?|assistant|chatbot|chat\s?bot|gpt|llm|smart|intelligent|personaliz)\b/i,
    packages: [
      p(
        "expo-audio",
        "Native Audio Recording & Voice API",
        "SDK 52+ audio engine for recording voice dictation prompts and playing AI voice responses.",
        "Essential",
        "expo",
        false,
        "app.json microphone permission string",
        true,
        ["expo-speech"],
        "https://docs.expo.dev/versions/latest/sdk/audio/"
      ),
      p(
        "react-native-markdown-display",
        "Fast Markdown Renderer",
        "Tokenizes and formats AI streaming markdown responses, code blocks, and lists.",
        "Recommended",
        "npm",
        false,
        "Zero extra config",
        false,
        [],
        "https://github.com/iamhowch/react-native-markdown-display"
      ),
    ],
    routes: ["app/(tabs)/assistant.tsx"],
  },
];

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
  const order: (PackageCategory | PackageTier)[] = [];
  const map = new Map<PackageCategory | PackageTier, StackPackage[]>();
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

function categoryRoute(category: PackageCategory | PackageTier): string | null {
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
  lines.push(`├─ src/`);
  lines.push(`│  ├─ app/`);
  lines.push(`│  │  ├─ _layout.tsx`);
  if (hasAuth) {
    lines.push(`│  │  ├─ (auth)/`);
    lines.push(`│  │  │  ├─ _layout.tsx`);
    lines.push(`│  │  │  ├─ sign-in.tsx`);
    lines.push(`│  │  │  └─ sign-up.tsx`);
  }
  if (hasTabs) {
    lines.push(`│  │  ├─ (tabs)/`);
    lines.push(`│  │  │  ├─ _layout.tsx`);
    lines.push(`│  │  │  ├─ index.tsx`);
    tabScreens.forEach((screen) => lines.push(`│  │  │  ├─ ${screen}`));
    lines.push(`│  │  │  └─ profile.tsx`);
  } else {
    lines.push(`│  │  ├─ index.tsx`);
  }
  lines.push(`│  │  └─ +not-found.tsx`);
  lines.push(`│  ├─ features/`);
  lines.push(`│  ├─ components/ui/`);
  lines.push(`│  └─ services/`);
  lines.push(`├─ assets/`);
  lines.push(`├─ app.json`);
  lines.push(`├─ tailwind.config.js`);
  lines.push(`└─ package.json`);
  return lines.join("\n");
}

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

export function flattenPackages(groups: StackGroup[]): StackPackage[] {
  return groups.flatMap((g) => g.packages);
}

function matchCategory(prompt: string): string {
  const pLower = prompt.toLowerCase();
  for (const catKey of Object.keys(PRINCIPAL_ENGINEER_KNOWLEDGE_BASE)) {
    if (pLower.includes(catKey.toLowerCase())) {
      return catKey;
    }
  }
  if (pLower.includes("food") || pLower.includes("restaurant") || pLower.includes("delivery")) return "Food Delivery";
  if (pLower.includes("social") || pLower.includes("feed") || pLower.includes("post")) return "Social App";
  if (pLower.includes("chat") || pLower.includes("message")) return "Messaging";
  if (pLower.includes("shop") || pLower.includes("market") || pLower.includes("buy")) return "Marketplace";
  if (pLower.includes("health") || pLower.includes("doctor") || pLower.includes("patient")) return "Healthcare";
  if (pLower.includes("bank") || pLower.includes("money") || pLower.includes("finance")) return "Banking";
  if (pLower.includes("workout") || pLower.includes("fitness") || pLower.includes("gym")) return "Fitness";
  if (pLower.includes("learn") || pLower.includes("course") || pLower.includes("education")) return "Education";
  if (pLower.includes("flight") || pLower.includes("hotel") || pLower.includes("travel")) return "Travel";
  if (pLower.includes("lead") || pLower.includes("crm") || pLower.includes("sales")) return "CRM";
  if (pLower.includes("inventory") || pLower.includes("stock") || pLower.includes("warehouse")) return "Inventory";
  if (pLower.includes("ai") || pLower.includes("gpt") || pLower.includes("bot")) return "AI Assistant";
  if (pLower.includes("expense") || pLower.includes("budget")) return "Expense Tracker";
  return "Productivity";
}

const DEFAULT_PROMPT =
  "A food delivery app with user login, live order tracking on maps, push notifications, and secure in-app payments.";

export function generateStack(rawPrompt: string): GeneratedStack {
  const prompt = rawPrompt.trim().length > 0 ? rawPrompt.trim() : DEFAULT_PROMPT;
  const matched = RULES.filter((rule) => rule.keywords.test(prompt));

  const allRawPackages: StackPackage[] = [
    ...CORE.flatMap((g) => g.packages),
    ...matched.flatMap((rule) =>
      rule.packages.map((seed) => ({
        ...seed,
        category: rule.category,
      }))
    ),
  ];

  // Deduplicate packages by name
  const seenPkgs = new Set<string>();
  const uniquePkgs: StackPackage[] = [];
  for (const pkg of allRawPackages) {
    if (!seenPkgs.has(pkg.name)) {
      seenPkgs.add(pkg.name);
      uniquePkgs.push(pkg);
    }
  }

  // Group into three distinct Tiers: Essential, Recommended, Optional
  const essentialPkgs = uniquePkgs.filter((p) => p.tier === "Essential" || (!p.tier && !p.optional));
  const recommendedPkgs = uniquePkgs.filter((p) => p.tier === "Recommended");
  const optionalPkgs = uniquePkgs.filter((p) => p.tier === "Optional" || p.optional);

  const groups: StackGroup[] = [
    ...(essentialPkgs.length > 0 ? [{ category: "Essential" as const, packages: essentialPkgs }] : []),
    ...(recommendedPkgs.length > 0 ? [{ category: "Recommended" as const, packages: recommendedPkgs }] : []),
    ...(optionalPkgs.length > 0 ? [{ category: "Optional" as const, packages: optionalPkgs }] : []),
  ];

  const { displayName, appName } = deriveNames(prompt);
  const categoryKey = matchCategory(prompt);
  const knowledge = PRINCIPAL_ENGINEER_KNOWLEDGE_BASE[categoryKey] || PRINCIPAL_ENGINEER_KNOWLEDGE_BASE["Productivity"];

  const summary = `Architectural blueprint generated for ${categoryKey}. Designed with a Feature-First modular structure and offline-first resilience.`;

  const detectedFeatures: DetectedFeature[] = matched.map((r, i) => ({
    id: `det-${i + 1}`,
    name: `${r.category} Engine`,
    description: `Core functionality for ${r.category.toLowerCase()}`,
    category: r.category,
    priority: "must-have",
  }));

  const inferredFeatures: InferredFeature[] = knowledge.inferredCapabilities.slice(0, 5).map((cap, i) => ({
    id: `inf-${i + 1}`,
    name: cap,
    description: `Implicit production requirement for ${categoryKey}`,
    category: "Architecture",
    justification: `Essential production safeguard inferred by Principal Architect for ${categoryKey}.`,
    ommissionRisk: i === 0 ? "Critical" : i < 3 ? "High" : "Medium",
  }));

  const architectureDecisions: ArchitectureDecisionsData = {
    pattern: {
      name: "Feature-First Modular Architecture",
      description: "Encapsulates app features in domain subdirectories for high maintainability.",
      reasonForChoice: `Prevents cross-domain coupling in ${categoryKey} codebases.`,
    },
    stateStrategy: {
      clientState: "Zustand (Global UI State)",
      serverState: "TanStack Query v5 (Optimistic Sync)",
      formState: "React Hook Form + Zod",
      rationale: "Clean separation between transient UI state and remote server state.",
    },
    dataPersistence: {
      primaryStorage: "op-sqlite",
      cacheLayer: "react-native-mmkv",
    },
    routingModel: {
      framework: "Expo Router v3 (File-based)",
      typeSafety: "Strict Typed Routes",
      deepLinkingScheme: appName.replace(/-/g, ""),
    },
    offlineStrategy: {
      mode: knowledge.offlineStrategy,
      queueEngine: "TanStack Query Mutations + MMKV Persister",
      conflictResolution: "Last-Write-Wins",
    },
    securityModel: {
      secureStorage: "Expo SecureStore",
      authHeaderStrategy: "Bearer JWT with Silent Refresh Queue",
      biometricsEnabled: true,
    },
    tradeOffRationale: knowledge.securityConsiderations,
  };

  const cloudServices: CloudService[] = Object.values(RECOMMENDED_CLOUD_SERVICES_MATRIX);

  const environmentVariables: EnvironmentVariableItem[] = [
    {
      key: `EXPO_PUBLIC_API_URL`,
      description: "Base API URL for remote backend services",
      isPublic: true,
      required: true,
      exampleValue: "https://api.example.com",
      stage: "all",
    },
    {
      key: `EXPO_PUBLIC_${appName.toUpperCase().replace(/-/g, "_")}_KEY`,
      description: "Public client application identifier",
      isPublic: true,
      required: true,
      exampleValue: "pk_live_984210",
      stage: "all",
    },
  ];

  const permissions: PermissionItem[] = [
    {
      permissionKey: "NSCameraUsageDescription",
      platform: "ios",
      userPromptReason: "Allow camera access for scanning and media capture.",
      configPluginRequired: true,
    },
    {
      permissionKey: "NSLocationWhenInUseUsageDescription",
      platform: "ios",
      userPromptReason: "Allow location access to enable maps and nearby discovery.",
      configPluginRequired: true,
    },
  ];

  const roadmap: RoadmapPhaseItem[] = [
    {
      phaseNumber: 1,
      title: "Foundation & Routing Setup",
      description: "Initialize Expo Router v3, NativeWind styling, and theme provider.",
      estimatedDays: 3,
      milestones: [
        {
          id: "m-1",
          task: "Configure Expo Router file-based layout and tab navigation",
          category: "Setup",
          deliverable: "Working tab navigator and root stack",
        },
      ],
    },
    {
      phaseNumber: 2,
      title: "Data Layer & Auth Persistence",
      description: "Setup Supabase client, OP-SQLite local cache, and SecureStore token persistence.",
      estimatedDays: 4,
      milestones: [
        {
          id: "m-2",
          task: "Implement offline mutation queue and MMKV cache persister",
          category: "Backend",
          deliverable: "Zero-data-loss local persistence layer",
        },
      ],
    },
    {
      phaseNumber: 3,
      title: "Core Feature & Production Hardening",
      description: "Build domain features, configure push notifications, and add Sentry telemetry.",
      estimatedDays: 7,
      milestones: [
        {
          id: "m-3",
          task: "Integrate Sentry crash reporting and OTA updates",
          category: "Testing",
          deliverable: "Production-ready build pipeline",
        },
      ],
    },
  ];

  const evaluation: ArchitectureEvaluationData = {
    overallScore: 92,
    scoreBreakdown: {
      scalability: 94,
      maintainability: 95,
      offlineResilience: 90,
      securityGrade: 92,
      developerVelocity: 91,
    },
    complexity: {
      level: "Medium",
      rating: 6,
      keyDrivers: ["Offline synchronization queue", "Real-time state subscriptions"],
    },
    timeline: {
      estimatedTotalWeeks: 3,
      estimatedDeveloperHours: 110,
      recommendedTeamSize: "1-2 Mobile Engineers",
      phaseDurations: {
        "Phase 1": "3 Days",
        "Phase 2": "4 Days",
        "Phase 3": "7 Days",
      },
    },
    risksAndMitigations: [
      {
        risk: "Intermittent cellular connectivity causing mutation drops",
        impact: "High",
        mitigationStrategy: "Use local OP-SQLite mutation queue with exponential backoff sync.",
      },
    ],
  };

  const executiveSummary: ExecutiveSummaryData = {
    applicationType: `${categoryKey} (${knowledge.commonArchitecture.split("+")[0].trim()})`,
    complexity: "Medium (6/10)",
    estimatedDevTime: "~3 Weeks (110 developer hours)",
    estimatedMonthlyCost: "$0.00 / mo (Free Tier Start)",
    productionReadiness: "92% Production Ready",
    readinessFlags: {
      offlineReady: true,
      authReady: matched.some((r) => r.id === "auth") || Boolean(knowledge.inferredCapabilities.some(c => c.includes("Auth"))),
      paymentsReady: matched.some((r) => r.id === "payments") || Boolean(knowledge.inferredCapabilities.some(c => c.includes("Pay"))),
      analyticsReady: true,
      notificationReady: matched.some((r) => r.id === "notifications") || Boolean(knowledge.inferredCapabilities.some(c => c.includes("Push"))),
    },
    expoCompatibility: "Expo SDK 52+ Universal (iOS, Android, Web)",
    potentialRisks: [
      "Intermittent cellular connectivity causing mutation drops during background sync.",
      "iOS background location/audio tasks being throttled by OS power management."
    ],
    missingFeatures: [
      "Multi-tenant team RBAC permissions module",
      "Automated PDF export report generator"
    ],
    recommendedImprovements: [
      "Integrate PostHog Feature Flags for dynamic feature rollouts without App Store resubmission.",
      "Configure Sentry source-map symbolication in CI/CD build pipeline."
    ]
  };

  const defaultView: OutputView = matched.length > 0 ? "structure" : "config";

  return {
    appName,
    displayName,
    summary,
    category: categoryKey,
    archetype: knowledge.commonArchitecture.split("+")[0].trim(),
    groups,
    folderStructure: buildFolderStructure(appName, groups),
    appJson: buildAppJson(
      appName,
      displayName,
      flattenPackages(groups).filter((pkg) => pkg.defaultSelected),
    ),
    defaultView,
    source: "local",

    // Dashboard data
    executiveSummary,
    detectedFeatures,
    inferredFeatures,
    architectureDecisions,
    rationales: ARCHITECTURAL_RATIONALES,
    cloudServices,
    environmentVariables,
    permissions,
    roadmap,
    evaluation,
  };
}

export const EXAMPLE_PROMPTS: string[] = [
  "A fitness tracking app with biometric login, offline sync, real-time maps, and AI workout recommendations.",
  "A social photo app with camera capture, an image feed, animations, and push notifications.",
  "A marketplace app with secure payments, live chat, and location-based search.",
];

export const DEFAULT_PLACEHOLDER =
  "A fitness tracking app with biometric login, offline sync, real-time maps, and AI workout recommendations.";
