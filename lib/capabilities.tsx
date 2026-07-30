import type { StackPackage } from "./types";

/** Which animated mockup a capability shows in the phone preview. */
export type SceneId =
  | "auth"
  | "payments"
  | "database"
  | "notifications"
  | "maps"
  | "camera"
  | "chat"
  | "ai"
  | "analytics"
  | "media"
  | "generic";

/** Plain-language grouping tiers a non-technical user understands. */
export type CapabilityTier = "Foundation" | "Core" | "Optional";

export interface Capability {
  id: string;
  /** Plain, human label — no package jargon. */
  label: string;
  /** One sentence a non-technical founder understands. */
  description: string;
  tier: CapabilityTier;
  scene: SceneId;
  /** The curated package bundle this capability installs. */
  packages: StackPackage[];
  /** Foundation is always included and can't be turned off. */
  foundation?: boolean;
  /** Regex over the prompt to auto-recommend even without a detected package. */
  match?: RegExp;
}

/** Compact package factory for the catalog. */
function pk(
  name: string,
  installer: "expo" | "npm",
  tier: "Essential" | "Recommended" | "Optional",
  reason: string,
  docUrl = "https://docs.expo.dev/versions/latest/sdk/overview/",
): StackPackage {
  return {
    name,
    reason,
    purpose: reason,
    category: "Core",
    tier,
    installer,
    optional: tier === "Optional",
    defaultSelected: tier !== "Optional",
    expoCompatibility: "Expo SDK 52+ Compatible",
    docUrl,
  };
}

export const CAPABILITY_CATALOG: Capability[] = [
  {
    id: "foundation",
    label: "App Foundation",
    description:
      "The essentials every app needs: screens & navigation, styling, data fetching, fonts and icons.",
    tier: "Foundation",
    scene: "generic",
    foundation: true,
    packages: [
      pk("expo-router", "expo", "Essential", "File-based navigation between your screens.", "https://docs.expo.dev/router/introduction/"),
      pk("nativewind", "npm", "Essential", "Tailwind CSS styling that works on iOS, Android, and web.", "https://www.nativewind.dev/"),
      pk("@tanstack/react-query", "npm", "Essential", "Loads and caches data from your backend automatically.", "https://tanstack.com/query/latest"),
      pk("react-native-safe-area-context", "expo", "Essential", "Keeps content clear of notches and home indicators."),
      pk("expo-status-bar", "expo", "Essential", "Controls the top status bar appearance."),
      pk("expo-constants", "expo", "Essential", "Reads app config and environment values."),
      pk("expo-font", "expo", "Recommended", "Loads custom fonts.", "https://docs.expo.dev/versions/latest/sdk/font/"),
      pk("@expo/vector-icons", "expo", "Recommended", "Thousands of ready-to-use icons."),
    ],
  },
  {
    id: "auth",
    label: "Accounts & Login",
    description:
      "Let people sign up, log in, and stay signed in — with email, Google/Apple, and Face ID.",
    tier: "Core",
    scene: "auth",
    match: /\b(auth|login|sign|account|user|profile|member|biometric|face\s?id)\b/i,
    packages: [
      pk("expo-secure-store", "expo", "Essential", "Safely stores login tokens using device encryption.", "https://docs.expo.dev/versions/latest/sdk/securestore/"),
      pk("expo-local-authentication", "expo", "Recommended", "Adds Face ID / Touch ID / fingerprint unlock.", "https://docs.expo.dev/versions/latest/sdk/local-authentication/"),
      pk("expo-auth-session", "expo", "Recommended", "Sign in with Google, Apple, or GitHub.", "https://docs.expo.dev/versions/latest/sdk/auth-session/"),
      pk("expo-crypto", "expo", "Optional", "Secure hashing for auth flows (PKCE, tokens)."),
    ],
  },
  {
    id: "cloud",
    label: "Cloud Backend",
    description:
      "A hosted database, user accounts, and APIs so your app has a real backend from day one.",
    tier: "Core",
    scene: "database",
    match: /\b(backend|api|server|cloud|supabase|firebase|database)\b/i,
    packages: [
      pk("@supabase/supabase-js", "npm", "Essential", "Hosted Postgres database, auth, and storage.", "https://supabase.com/docs"),
      pk("react-native-url-polyfill", "npm", "Essential", "Required polyfill for backend clients."),
    ],
  },
  {
    id: "database",
    label: "Local Data & Offline",
    description:
      "Save data on the phone so the app works without internet and syncs when it's back.",
    tier: "Core",
    scene: "database",
    match: /\b(offline|sync|local|database|store|cache|persist|sqlite)\b/i,
    packages: [
      pk("expo-sqlite", "expo", "Essential", "On-device database for offline-first data.", "https://docs.expo.dev/versions/latest/sdk/sqlite/"),
      pk("react-native-mmkv", "npm", "Recommended", "Ultra-fast storage for settings and cache.", "https://github.com/mrousavy/react-native-mmkv"),
      pk("@react-native-community/netinfo", "npm", "Recommended", "Detects when the device goes online/offline."),
      pk("drizzle-orm", "npm", "Optional", "Typed queries and migrations over SQLite.", "https://orm.drizzle.team/"),
    ],
  },
  {
    id: "payments",
    label: "Payments & Subscriptions",
    description:
      "Take card payments, Apple/Google Pay, and recurring subscriptions.",
    tier: "Core",
    scene: "payments",
    match: /\b(pay|payment|checkout|subscription|billing|stripe|purchase|cart|order|ecommerce|shop)\b/i,
    packages: [
      pk("@stripe/stripe-react-native", "npm", "Essential", "Card payments with Apple Pay & Google Pay.", "https://stripe.com/docs/stripe-react-native"),
      pk("expo-web-browser", "expo", "Recommended", "Opens secure checkout and billing portals."),
      pk("react-native-purchases", "npm", "Optional", "RevenueCat in-app subscriptions across stores.", "https://www.revenuecat.com/docs"),
    ],
  },
  {
    id: "notifications",
    label: "Push Notifications",
    description:
      "Send alerts, reminders, and re-engagement messages to your users.",
    tier: "Core",
    scene: "notifications",
    match: /\b(notification|push|alert|remind|reengage|inbox)\b/i,
    packages: [
      pk("expo-notifications", "expo", "Essential", "Send and schedule push & local notifications.", "https://docs.expo.dev/versions/latest/sdk/notifications/"),
      pk("expo-device", "expo", "Recommended", "Needed to register a device for push."),
    ],
  },
  {
    id: "maps",
    label: "Maps & Location",
    description:
      "Show maps, place pins, get the user's location, and draw routes.",
    tier: "Core",
    scene: "maps",
    match: /\b(map|maps|location|gps|nearby|route|navigation|delivery|ride|track)\b/i,
    packages: [
      pk("expo-location", "expo", "Essential", "Reads GPS location with permission handling.", "https://docs.expo.dev/versions/latest/sdk/location/"),
      pk("react-native-maps", "npm", "Essential", "Interactive Apple/Google maps with markers.", "https://github.com/react-native-maps/react-native-maps"),
      pk("expo-task-manager", "expo", "Optional", "Keeps tracking location in the background."),
    ],
  },
  {
    id: "camera",
    label: "Camera & Scanning",
    description:
      "Take photos and videos, and scan QR codes or barcodes.",
    tier: "Core",
    scene: "camera",
    match: /\b(camera|scan|qr|barcode|selfie|capture|document)\b/i,
    packages: [
      pk("expo-camera", "expo", "Essential", "Camera capture plus QR / barcode scanning.", "https://docs.expo.dev/versions/latest/sdk/camera/"),
    ],
  },
  {
    id: "media",
    label: "Photos & Video",
    description:
      "Pick, display, and play images and video with a smooth, cached experience.",
    tier: "Core",
    scene: "media",
    match: /\b(photo|image|gallery|media|video|feed|story|avatar|upload)\b/i,
    packages: [
      pk("expo-image", "expo", "Essential", "Fast images with caching and blur placeholders.", "https://docs.expo.dev/versions/latest/sdk/image/"),
      pk("expo-image-picker", "expo", "Recommended", "Pick photos and videos from the library."),
      pk("expo-video", "expo", "Optional", "Modern video playback."),
      pk("expo-media-library", "expo", "Optional", "Save media to the device gallery."),
    ],
  },
  {
    id: "chat",
    label: "Chat & Messaging",
    description:
      "Real-time messaging, typing indicators, and live updates between users.",
    tier: "Core",
    scene: "chat",
    match: /\b(chat|message|messaging|dm|realtime|real-time|live|presence|social)\b/i,
    packages: [
      pk("@supabase/supabase-js", "npm", "Essential", "Real-time subscriptions for live messages.", "https://supabase.com/docs/guides/realtime"),
      pk("react-native-gifted-chat", "npm", "Recommended", "Ready-made chat UI components."),
      pk("stream-chat-expo", "npm", "Optional", "Full managed chat infrastructure.", "https://getstream.io/chat/docs/sdk/expo/"),
    ],
  },
  {
    id: "ai",
    label: "AI & Assistant",
    description:
      "Add an AI chatbot, smart recommendations, or a voice assistant.",
    tier: "Core",
    scene: "ai",
    match: /\b(ai|ml|assistant|chatbot|gpt|llm|smart|recommend|personaliz)\b/i,
    packages: [
      pk("ai", "npm", "Essential", "Vercel AI SDK for streaming model responses.", "https://sdk.vercel.ai/"),
      pk("openai", "npm", "Recommended", "Official OpenAI client."),
      pk("expo-speech", "expo", "Optional", "Text-to-speech for voice replies."),
    ],
  },
  {
    id: "analytics",
    label: "Analytics & Insights",
    description:
      "See how people use your app and what drives growth.",
    tier: "Core",
    scene: "analytics",
    match: /\b(analytics|metrics|track|funnel|insight|growth)\b/i,
    packages: [
      pk("posthog-react-native", "npm", "Recommended", "Product analytics, funnels, and feature flags.", "https://posthog.com/docs/libraries/react-native"),
      pk("expo-application", "expo", "Optional", "Reads app version/build for analytics."),
    ],
  },
  {
    id: "monitoring",
    label: "Crash Reporting",
    description:
      "Get alerted when the app crashes, with the exact line that broke.",
    tier: "Core",
    scene: "analytics",
    match: /\b(crash|error|monitor|sentry|stability)\b/i,
    packages: [
      pk("@sentry/react-native", "npm", "Recommended", "Crash reporting with source maps.", "https://docs.sentry.io/platforms/react-native/"),
    ],
  },
  {
    id: "storage",
    label: "File Storage & Uploads",
    description:
      "Let users upload files and documents, and manage them on device.",
    tier: "Optional",
    scene: "media",
    match: /\b(file|upload|document|attachment|pdf|storage)\b/i,
    packages: [
      pk("expo-file-system", "expo", "Recommended", "Read, write, and download files."),
      pk("expo-document-picker", "expo", "Recommended", "Pick documents from the device."),
    ],
  },
  {
    id: "animations",
    label: "Animations & Gestures",
    description:
      "Smooth, native-feeling motion, swipes, and interactive gestures.",
    tier: "Optional",
    scene: "generic",
    match: /\b(anim|animation|gesture|swipe|drag|smooth|interactive|carousel)\b/i,
    packages: [
      pk("react-native-reanimated", "npm", "Recommended", "60fps animations on the native thread.", "https://docs.swmansion.com/react-native-reanimated/"),
      pk("react-native-gesture-handler", "npm", "Recommended", "Native swipe and gesture handling."),
      pk("moti", "npm", "Optional", "Simple declarative animations."),
      pk("lottie-react-native", "npm", "Optional", "Play designer vector animations."),
    ],
  },
  {
    id: "forms",
    label: "Forms & Validation",
    description:
      "Build reliable input forms with clear validation and error messages.",
    tier: "Optional",
    scene: "generic",
    match: /\b(form|input|survey|onboarding\s?form|checkout\s?form|validation)\b/i,
    packages: [
      pk("react-hook-form", "npm", "Recommended", "Performant, ergonomic forms."),
      pk("zod", "npm", "Recommended", "Type-safe validation schemas."),
    ],
  },
  {
    id: "i18n",
    label: "Multiple Languages",
    description:
      "Translate your app and adapt to the user's language and region.",
    tier: "Optional",
    scene: "generic",
    match: /\b(language|translat|i18n|localiz|multilingual|region)\b/i,
    packages: [
      pk("i18next", "npm", "Recommended", "Translation framework."),
      pk("react-i18next", "npm", "Recommended", "React bindings for translations."),
      pk("expo-localization", "expo", "Recommended", "Detects device language & region."),
    ],
  },
  {
    id: "sharing",
    label: "Sharing & Deep Links",
    description:
      "Share content out of the app and open it from links and invites.",
    tier: "Optional",
    scene: "generic",
    match: /\b(share|sharing|invite|deep\s?link|referral|link)\b/i,
    packages: [
      pk("expo-linking", "expo", "Recommended", "Handle incoming deep links."),
      pk("expo-sharing", "expo", "Recommended", "Share files and content to other apps."),
    ],
  },
  {
    id: "updates",
    label: "Instant Updates (OTA)",
    description:
      "Ship fixes and features instantly without waiting for app-store review.",
    tier: "Optional",
    scene: "generic",
    match: /\b(update|ota|hotfix|release)\b/i,
    packages: [
      pk("expo-updates", "expo", "Recommended", "Over-the-air JavaScript updates.", "https://docs.expo.dev/versions/latest/sdk/updates/"),
    ],
  },
  {
    id: "ads",
    label: "Ads & Monetization",
    description:
      "Earn revenue by showing ads alongside your content.",
    tier: "Optional",
    scene: "generic",
    match: /\b(ads?|advert|monetiz|admob)\b/i,
    packages: [
      pk("react-native-google-mobile-ads", "npm", "Recommended", "Google AdMob banner & interstitial ads.", "https://docs.page/invertase/react-native-google-mobile-ads"),
    ],
  },
  {
    id: "device",
    label: "Device Features",
    description:
      "Haptic feedback, motion sensors, contacts, and calendar access.",
    tier: "Optional",
    scene: "generic",
    match: /\b(haptic|vibrat|sensor|accelerometer|contact|calendar|device)\b/i,
    packages: [
      pk("expo-haptics", "expo", "Recommended", "Tactile vibration feedback."),
      pk("expo-sensors", "expo", "Optional", "Accelerometer, gyroscope, and more."),
      pk("expo-contacts", "expo", "Optional", "Read and write device contacts."),
      pk("expo-calendar", "expo", "Optional", "Create and read calendar events."),
    ],
  },
  {
    id: "audio",
    label: "Audio & Voice",
    description:
      "Record voice, play audio, and add sound to your app.",
    tier: "Optional",
    scene: "generic",
    match: /\b(audio|voice|record|sound|music|podcast|dictation)\b/i,
    packages: [
      pk("expo-audio", "expo", "Recommended", "Record and play audio (SDK 52+)."),
      pk("expo-speech", "expo", "Optional", "Text-to-speech."),
    ],
  },
];

/** Every unique package across the catalog (the install universe). */
export function catalogUniverse(): StackPackage[] {
  const seen = new Set<string>();
  const out: StackPackage[] = [];
  for (const cap of CAPABILITY_CATALOG) {
    for (const p of cap.packages) {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        out.push(p);
      }
    }
  }
  return out;
}

export interface DerivedCapability {
  capability: Capability;
  /** Detected in the generated stack or matched from the prompt. */
  recommended: boolean;
}

/**
 * Decide which capabilities to pre-enable, given the packages the generator
 * produced plus the original prompt. Foundation is always recommended.
 */
export function deriveCapabilities(
  presentPackageNames: Set<string>,
  prompt: string,
): DerivedCapability[] {
  return CAPABILITY_CATALOG.map((capability) => {
    if (capability.foundation) return { capability, recommended: true };
    const hasPackage = capability.packages.some((p) =>
      presentPackageNames.has(p.name),
    );
    const matchesPrompt = capability.match?.test(prompt) ?? false;
    return { capability, recommended: hasPackage || matchesPrompt };
  });
}
