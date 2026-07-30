import { ArchitecturalRationale } from "../types";

export const ARCHITECTURAL_RATIONALES: ArchitecturalRationale[] = [
  {
    domain: "Navigation",
    recommendation: "Expo Router v3",
    reasons: [
      "Official Expo framework solution built on Metro and React Native.",
      "Universal file-based routing across iOS, Android, and Web.",
      "Automatic typed routes and native deep linking schemes out of the box.",
      "Future-proof alignment with React Native Server Components."
    ],
    alternative: "React Navigation v6 (Standalone)",
    whenToUseAlternative: "Legacy non-Expo React Native codebases, or complex imperative navigation controllers requiring specialized C++ native stack transitions."
  },
  {
    domain: "State Management",
    recommendation: "Zustand + TanStack Query v5",
    reasons: [
      "Strict separation between transient client UI state and server asynchronous data.",
      "Zero boilerplate, hook-first, sub-millisecond atomic re-renders with Zustand.",
      "Automatic caching, query deduplication, background polling, and optimistic UI mutations via TanStack Query."
    ],
    alternative: "Redux Toolkit / Jotai",
    whenToUseAlternative: "Large enterprise teams requiring central action dispatch logs, time-travel devtools debugging, or atomic bottom-up state primitives."
  },
  {
    domain: "Networking",
    recommendation: "Native Fetch API + TanStack Query Interceptors",
    reasons: [
      "Zero added bundle weight; relies on web-standard fetch engine built into React Native.",
      "Supports silent JWT token refresh queues and global request/response interceptors.",
      "Automatic exponential backoff retries and offline mutation persistence."
    ],
    alternative: "tRPC / GraphQL (Apollo Client)",
    whenToUseAlternative: "Full-stack TypeScript monorepos desiring end-to-end type safety without manual OpenAPI codegen, or graph-based query backends."
  },
  {
    domain: "Authentication",
    recommendation: "Supabase Auth / Firebase Auth + Expo SecureStore",
    reasons: [
      "Hardware-backed token encryption via iOS Keychain and Android Keystore.",
      "Turnkey OAuth 2.0 PKCE social providers (Apple, Google, GitHub) and Magic Links.",
      "Seamless integration with biometric locks via expo-local-authentication."
    ],
    alternative: "Clerk / Auth0 / Custom Node JWT Service",
    whenToUseAlternative: "B2B SaaS apps requiring multi-tenant organization switching, SAML SSO enterprise logins, or custom hardware security modules."
  },
  {
    domain: "Storage",
    recommendation: "react-native-mmkv",
    reasons: [
      "30x faster than legacy AsyncStorage via C++ synchronous JSI bindings.",
      "Ideal for instant query-cache hydration, user settings, and feature flags.",
      "Low memory footprint with zero asynchronous event loop latency."
    ],
    alternative: "AsyncStorage / Expo SecureStore",
    whenToUseAlternative: "Simple non-performance-critical apps, or storing sensitive OAuth tokens requiring hardware key vault encryption."
  },
  {
    domain: "Media",
    recommendation: "expo-image & expo-video & expo-audio",
    reasons: [
      "Official Expo SDK 52+ specialized media modules replacing legacy monolithic packages.",
      "Built-in Blurhash/Thumbhash placeholders, disk caching, and memory recycling.",
      "Modern VideoPlayer architecture separating UI <VideoView /> from background decoding."
    ],
    alternative: "react-native-fast-image / react-native-video",
    whenToUseAlternative: "Legacy bare React Native projects without Expo continuous native workflow support."
  },
  {
    domain: "Analytics",
    recommendation: "PostHog React Native / Mixpanel",
    reasons: [
      "Open-source privacy control with session replay and feature flag toggles.",
      "Automatic screen tracking integration with Expo Router file routes.",
      "Zero impact on main thread UI rendering or frame rates."
    ],
    alternative: "Google Analytics (Firebase Analytics) / Amplitude",
    whenToUseAlternative: "Enterprise marketing teams deeply integrated into Google AdMob or Firebase ad conversion attribution funnels."
  },
  {
    domain: "Notifications",
    recommendation: "Expo Push Notifications / OneSignal",
    reasons: [
      "Cross-platform push token registration abstraction over APNs & FCM.",
      "Background notification handlers and interactive actions out of the box.",
      "Works seamlessly in both Expo Go and custom development client builds."
    ],
    alternative: "Notifee / Direct Firebase Cloud Messaging (FCM)",
    whenToUseAlternative: "Custom Android notification channels requiring rich local media controls, custom foreground services, or complex action buttons."
  },
  {
    domain: "Payments",
    recommendation: "@stripe/stripe-react-native / RevenueCat",
    reasons: [
      "Stripe: Official PCI-compliant payment sheet with Apple Pay & Google Pay.",
      "RevenueCat: Cross-platform SDK simplifying App Store & Google Play in-app purchase entitlements.",
      "Automates receipt validation, server webhooks, and subscription lifecycle management."
    ],
    alternative: "react-native-iap / PayPal SDK",
    whenToUseAlternative: "One-time raw native IAP implementations without third-party BaaS fees, or web checkout redirects."
  },
  {
    domain: "Database",
    recommendation: "op-sqlite / expo-sqlite",
    reasons: [
      "Ultra-fast embedded C++ SQLite engine via JSI bindings.",
      "Enables local-first offline storage, complex SQL joins, and FTS5 full-text search.",
      "Pairs with modern ORMs like Drizzle for full end-to-end type safety."
    ],
    alternative: "WatermelonDB / Realm (Atlas Device SDK)",
    whenToUseAlternative: "Reactive observation of 100,000+ local records, or automatic multi-device cloud synchronization engines."
  },
  {
    domain: "Logging",
    recommendation: "react-native-logs / Structured Console Logger",
    reasons: [
      "Transport-agnostic logging (console, local log file, remote HTTP endpoint).",
      "Environment-aware level filtering (debug in dev, error-only in production).",
      "Colorized console formatting for fast developer debugging."
    ],
    alternative: "datadog-react-native-logs / Winston",
    whenToUseAlternative: "Enterprise SOC compliance requiring centralized SIEM audit logs and log retention policies."
  },
  {
    domain: "Error Tracking",
    recommendation: "@sentry/react-native",
    reasons: [
      "Automated source map symbolication for minified JS bundle stack traces.",
      "Captures native iOS (Swift/Obj-C) and Android (Java/Kotlin/C++) crashes.",
      "Performance monitoring, breadcrumb tracking, and release health telemetry."
    ],
    alternative: "Bugsnag / Firebase Crashlytics",
    whenToUseAlternative: "Teams already using Google Cloud Platform / Firebase suite with no requirement for JS source-map symbolication customization."
  },
  {
    domain: "Testing",
    recommendation: "Jest + React Native Testing Library (RNTL) + Detox",
    reasons: [
      "RNTL: Focuses on user-centric testing (accessibility labels, queries) rather than internal implementation details.",
      "Jest: Fast parallel execution with snapshot testing.",
      "Detox: Gray-box end-to-end native UI testing on iOS Simulators & Android Emulators."
    ],
    alternative: "Maestro / Cypress (Web)",
    whenToUseAlternative: "Declarative YAML-based E2E UI testing requiring zero setup code or native compilation hooks."
  },
  {
    domain: "Performance",
    recommendation: "React Native Reanimated v3 + @shopify/flash-list + Hermes Engine",
    reasons: [
      "Reanimated: Executes 60fps animations on the UI thread, bypassing the JS bridge.",
      "FlashList: 5x faster list rendering than legacy FlatList using view recycling.",
      "Hermes: Default JS engine optimized for sub-100ms startup, low memory footprint, and bytecode pre-compilation."
    ],
    alternative: "react-native-skia / Legacy FlatList",
    whenToUseAlternative: "High-performance 2D canvas drawing, custom shader effects, or simple low-item static lists."
  }
];
