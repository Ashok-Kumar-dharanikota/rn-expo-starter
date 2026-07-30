export interface DomainKnowledgeSpec {
  category: string;
  typicalFeatures: string[];
  inferredCapabilities: string[];
  recommendedServices: string[];
  recommendedPackages: string[];
  commonArchitecture: string;
  securityConsiderations: string[];
  performanceConsiderations: string[];
  offlineStrategy: string;
  monetizationStrategy: string;
}

export const PRINCIPAL_ENGINEER_KNOWLEDGE_BASE: Record<string, DomainKnowledgeSpec> = {
  "Food Delivery": {
    category: "Food Delivery",
    typicalFeatures: [
      "Restaurant discovery & search",
      "Cart management & checkout",
      "Real-time courier tracking on map",
      "Order status pipeline & webhooks",
      "Ratings & reviews",
      "Push notifications for delivery stages"
    ],
    inferredCapabilities: [
      "Maps & Geofencing",
      "Payments & Escrow",
      "Real-Time Telemetry",
      "Push Notifications",
      "Deep Linking",
      "Image Upload & CDN",
      "Offline Cart Storage",
      "Auth & Phone OTP",
      "Image Caching",
      "Sentry Crash Reporting"
    ],
    recommendedServices: [
      "Supabase (Auth, Database, Realtime)",
      "Stripe Connect (Payments & Refunds)",
      "Google Maps API / Mapbox",
      "Expo Push Notifications / OneSignal",
      "Sentry Telemetry",
      "Cloudflare R2 Storage"
    ],
    recommendedPackages: [
      "react-native-maps",
      "expo-location",
      "expo-notifications",
      "expo-image",
      "@stripe/stripe-react-native",
      "expo-secure-store",
      "react-native-mmkv",
      "@tanstack/react-query"
    ],
    commonArchitecture: "Feature-First Modular + Real-Time WebSocket/Supabase driver telemetry pipeline with stateful active order bar.",
    securityConsiderations: [
      "PCI-DSS compliant payments via Stripe SDK",
      "TLS certificate pinning for payment endpoints",
      "Location obfuscation when driver is idle"
    ],
    performanceConsiderations: [
      "Map marker optimization using bitmap recycling",
      "Debounced driver GPS sampling",
      "Disk-cached restaurant menu thumbnails"
    ],
    offlineStrategy: "Local MMKV persistence for menu browsing & active cart; offline queue prevents cart loss during dropouts.",
    monetizationStrategy: "Delivery fee splits, restaurant commission percentage, sponsored listing placements, priority delivery subscriptions."
  },

  "Social App": {
    category: "Social App",
    typicalFeatures: [
      "Activity feed & dynamic posts",
      "User profile & follow system",
      "Media upload (photos/video)",
      "Likes, comments, & shares",
      "Hashtag & trending search"
    ],
    inferredCapabilities: [
      "Infinite Scroll Virtualization",
      "Dynamic Image Optimization",
      "Media Compression",
      "Video Player Lifecycle",
      "Push Notifications",
      "Auth & Social OAuth",
      "Content Moderation API",
      "Deep Links to Posts",
      "Sentry Observability"
    ],
    recommendedServices: [
      "Supabase / Firebase",
      "Cloudflare Stream / Mux (Video)",
      "AWS S3 / Cloudflare R2",
      "OneSignal",
      "PostHog",
      "Sentry"
    ],
    recommendedPackages: [
      "@shopify/flash-list",
      "expo-video",
      "expo-image",
      "expo-image-picker",
      "expo-sharing",
      "@tanstack/react-query",
      "zustand"
    ],
    commonArchitecture: "Layered Architecture with Infinite Paginated React Query state, optimistic reaction toggles, and background video pre-fetching.",
    securityConsiderations: [
      "OAuth 2.0 PKCE auth flow",
      "Signed upload URLs for user media",
      "User blocking & content reporting webhooks"
    ],
    performanceConsiderations: [
      "Virtualization using @shopify/flash-list",
      "Optimistic feed updates",
      "Recycling video players on scroll threshold"
    ],
    offlineStrategy: "Optimistic feed likes/comments queued in MMKV; last-known feed cached locally for instant app open.",
    monetizationStrategy: "In-app creator tips, premium verified badges, sponsored feed ads, exclusive subscriber-only content."
  },

  "Messaging": {
    category: "Messaging",
    typicalFeatures: [
      "1-on-1 & group chat channels",
      "Media attachments (photos, voice notes)",
      "Read receipts & typing indicators",
      "Presence status",
      "Push notifications"
    ],
    inferredCapabilities: [
      "Real-Time WebSockets",
      "Encrypted Local Database",
      "Audio Recorder & Player",
      "Push Notification Payload Decryption",
      "Background Fetch",
      "File Pickers",
      "Contact Sync",
      "Sentry Crash Reporting"
    ],
    recommendedServices: [
      "Supabase Realtime / Stream Chat",
      "Expo Push Engine",
      "Cloudflare R2",
      "Sentry"
    ],
    recommendedPackages: [
      "react-native-gifted-chat",
      "expo-audio",
      "expo-crypto",
      "expo-file-system",
      "op-sqlite",
      "expo-notifications",
      "zustand"
    ],
    commonArchitecture: "Event-Driven WebSocket Architecture with local-first SQLite message store and optimistic outbound queue.",
    securityConsiderations: [
      "End-to-End Encryption (E2EE) using expo-crypto",
      "Hardware-backed key storage via Expo SecureStore",
      "Biometric app lock"
    ],
    performanceConsiderations: [
      "Indexed SQLite message pagination",
      "Message window virtualization",
      "Waveform pre-rendering for voice notes"
    ],
    offlineStrategy: "Strict Local-First: messages write instantly to local SQLite and queue for socket dispatch upon reconnect.",
    monetizationStrategy: "Premium sticker packs, larger file transfer tiers, custom chat themes, group size expansions."
  },

  "Marketplace": {
    category: "Marketplace",
    typicalFeatures: [
      "Product catalog & category browsing",
      "Multi-facet search & filtering",
      "Seller storefronts",
      "Checkout & payment processing",
      "In-app buyer-seller messaging"
    ],
    inferredCapabilities: [
      "Multi-facet Search Index",
      "Payment Escrow",
      "Image Upload & Cropping",
      "Address Verification",
      "Push Notifications",
      "Deep Linking",
      "Inventory Locks",
      "Auth & Verification"
    ],
    recommendedServices: [
      "Algolia / Meilisearch",
      "Stripe Connect (Escrow & Seller Payouts)",
      "Supabase",
      "Cloudflare R2",
      "PostHog"
    ],
    recommendedPackages: [
      "@stripe/stripe-react-native",
      "expo-image-picker",
      "expo-router",
      "@tanstack/react-query",
      "react-native-mmkv",
      "expo-sharing"
    ],
    commonArchitecture: "Feature-Modular with Algolia instant search, stateful multi-step checkout coordinator, and seller dashboard.",
    securityConsiderations: [
      "Stripe Connect KYC compliance",
      "Server-authoritative inventory locks",
      "Seller payout verification logs"
    ],
    performanceConsiderations: [
      "Fast grid item virtualization",
      "Image lazy-loading with skeleton states",
      "Cached search query indexes"
    ],
    offlineStrategy: "Wishlist & draft listing creation stored locally in MMKV; price updates cached for offline viewing.",
    monetizationStrategy: "Buyer platform fee, seller transaction commission, featured item promotion fees, verified seller subscriptions."
  },

  "Healthcare": {
    category: "Healthcare",
    typicalFeatures: [
      "Doctor appointment booking",
      "Video consultation calls",
      "Prescription history & downloads",
      "Health metric logs",
      "Secure doctor-patient messaging"
    ],
    inferredCapabilities: [
      "HIPAA/GDPR Compliance",
      "Encrypted Storage",
      "Video Calling SDK",
      "Calendar Scheduling Sync",
      "Push Reminders",
      "Document Scanner",
      "Biometric Authentication",
      "Audit Logging"
    ],
    recommendedServices: [
      "Daily.co / Agora (Video WebRTC)",
      "AWS HIPAA S3",
      "Supabase (HIPAA BAA)",
      "OneSignal",
      "Sentry"
    ],
    recommendedPackages: [
      "expo-local-authentication",
      "expo-calendar",
      "expo-document-picker",
      "expo-secure-store",
      "expo-crypto",
      "expo-video"
    ],
    commonArchitecture: "Zero-Trust Layered Architecture with hardware-backed encryption keys and automatic session timeout guards.",
    securityConsiderations: [
      "HIPAA compliance audit trail",
      "AES-256 local database encryption",
      "Biometric re-auth wall on app unlock"
    ],
    performanceConsiderations: [
      "Low-latency WebRTC video stream tuning",
      "Background sync of sensor telemetry",
      "PDF prescription rendering optimization"
    ],
    offlineStrategy: "Prescriptions & appointments cached in encrypted SQLite; offline symptom logs synced when online.",
    monetizationStrategy: "Per-consultation fee, monthly family health subscription, insurance copay processing, premium specialist access."
  },

  "Banking": {
    category: "Banking",
    typicalFeatures: [
      "Account balance & ledger view",
      "Transaction history & categorization",
      "Money transfers (ACH/P2P)",
      "Card management & lock",
      "Analytics & spending breakdown"
    ],
    inferredCapabilities: [
      "Hardware Security Module (HSM)",
      "Biometric Auth",
      "Tokenized APIs",
      "Real-Time Fraud Alerts",
      "Push Notifications",
      "Secure PDF Statements",
      "Offline Balance Security"
    ],
    recommendedServices: [
      "Plaid API / MX",
      "Stripe / Unit / Banking-as-a-Service",
      "Supabase / AWS RDS",
      "Sentry",
      "PostHog"
    ],
    recommendedPackages: [
      "expo-local-authentication",
      "expo-secure-store",
      "expo-crypto",
      "react-native-svg",
      "react-native-mmkv",
      "expo-file-system"
    ],
    commonArchitecture: "Clean Architecture with strict Data-Domain-Presentation separation, immutable ledger records, and certificate pinning.",
    securityConsiderations: [
      "TLS certificate pinning",
      "Jailbreak & root detection hooks",
      "Zero sensitive data written to plain logs"
    ],
    performanceConsiderations: [
      "Sub-100ms cold startup time",
      "Heavy SVG financial chart performance",
      "Instant local ledger rendering"
    ],
    offlineStrategy: "Read-only transaction cache in MMKV; transfer executions blocked offline with clear network status banners.",
    monetizationStrategy: "Transaction interchange fees, premium metal card subscriptions, FX markup, cross-sold investment yields."
  },

  "Fitness": {
    category: "Fitness",
    typicalFeatures: [
      "Workout logging & routine builder",
      "GPS run/cycle tracking",
      "Audio voice coaching cues",
      "Progress charts & volume metrics",
      "Apple Health / Google Fit sync"
    ],
    inferredCapabilities: [
      "Background GPS Tracking",
      "HealthKit / Google Fit Integration",
      "Background Audio Playback",
      "Local Database Storage",
      "Chart Visualization",
      "Haptic Feedback"
    ],
    recommendedServices: [
      "Supabase / Firebase",
      "RevenueCat (Subscriptions)",
      "PostHog Analytics",
      "Sentry"
    ],
    recommendedPackages: [
      "expo-location",
      "expo-audio",
      "expo-haptics",
      "expo-sensors",
      "react-native-health",
      "op-sqlite",
      "@shopify/react-native-skia"
    ],
    commonArchitecture: "Local-First Reactive Engine using SQLite, background location task workers, and real-time audio cue queue.",
    securityConsiderations: [
      "Health data privacy consent prompts",
      "Secure Apple Health token handling",
      "Local encryption of personal telemetry"
    ],
    performanceConsiderations: [
      "GPS point throttling to save battery",
      "Background audio wake lock efficiency",
      "60fps Skia fitness charts"
    ],
    offlineStrategy: "100% Offline-Capable: workouts log directly to local SQLite database and sync asynchronously to cloud.",
    monetizationStrategy: "Monthly/Annual premium workout routines, AI personal trainer subscription via RevenueCat."
  },

  "Education": {
    category: "Education",
    typicalFeatures: [
      "Course catalog & video lessons",
      "Interactive quizzes & grading",
      "Progress tracking dashboard",
      "Downloadable lessons for offline study",
      "Discussion forums & Q&A"
    ],
    inferredCapabilities: [
      "DRM Video Playback",
      "Chunked File Downloader",
      "Progress State Synchronization",
      "Certificate PDF Generation",
      "Push Reminders",
      "Offline Content Vault"
    ],
    recommendedServices: [
      "Mux / AWS CloudFront (Video)",
      "Supabase",
      "RevenueCat / Stripe",
      "OneSignal",
      "Sentry"
    ],
    recommendedPackages: [
      "expo-video",
      "expo-file-system",
      "expo-sharing",
      "@tanstack/react-query",
      "react-native-mmkv",
      "react-native-pdf"
    ],
    commonArchitecture: "Feature-First with dedicated Offline Storage Manager for downloading media assets and tracking progress indices.",
    securityConsiderations: [
      "Signed HLS video URLs",
      "DRM content protection",
      "Secure certificate token verification"
    ],
    performanceConsiderations: [
      "Adaptive bitrate video streaming",
      "Background lesson downloads",
      "Fast local quiz state evaluation"
    ],
    offlineStrategy: "User-selected video & lesson package downloads saved to encrypted local app directory for complete offline study.",
    monetizationStrategy: "Monthly course subscription, per-course purchase, certified completion certificates, corporate enterprise tiers."
  },

  "Travel": {
    category: "Travel",
    typicalFeatures: [
      "Flight & hotel search",
      "Interactive map exploration",
      "Booking & itinerary manager",
      "Offline digital boarding passes",
      "Real-time flight status alerts"
    ],
    inferredCapabilities: [
      "Dynamic Map Clusters",
      "Date Range Pickers",
      "PDF/PassKit Ticket Storage",
      "Real-time Flight Status Alerts",
      "Currency Converter",
      "Multi-language Localization"
    ],
    recommendedServices: [
      "Amadeus / Skyscanner API",
      "Mapbox / Google Maps",
      "Stripe",
      "OneSignal",
      "Supabase"
    ],
    recommendedPackages: [
      "react-native-maps",
      "expo-location",
      "expo-calendar",
      "expo-notifications",
      "expo-localization",
      "@stripe/stripe-react-native",
      "react-native-mmkv"
    ],
    commonArchitecture: "Layered Architecture with centralized Itinerary Store, cached map tile management, and multi-currency converter middleware.",
    securityConsiderations: [
      "PCI-compliant payment flow",
      "Secure storage of passport/passenger details in Expo SecureStore"
    ],
    performanceConsiderations: [
      "Fast map marker clustering",
      "Cached flight search queries",
      "Lightweight SVG boarding passes"
    ],
    offlineStrategy: "Itineraries and barcode/QR boarding passes saved locally to MMKV/FileSystem for instant access without airport Wi-Fi.",
    monetizationStrategy: "Booking referral commissions, dynamic price protection add-ons, travel insurance upsells, VIP room upgrades."
  },

  "CRM": {
    category: "CRM",
    typicalFeatures: [
      "Lead management & sales pipeline",
      "Kanban deal board",
      "Call & email activity logging",
      "Task manager & follow-up alerts",
      "Sales analytics & team reports"
    ],
    inferredCapabilities: [
      "Contact Picker & Sync",
      "Device Phone/Email Intent Integration",
      "Offline Mutation Queue",
      "File Attachment Scanner",
      "Push Reminders",
      "Search Indexing"
    ],
    recommendedServices: [
      "Supabase / Salesforce API",
      "PostHog",
      "OneSignal",
      "Cloudflare R2",
      "Sentry"
    ],
    recommendedPackages: [
      "expo-contacts",
      "expo-linking",
      "expo-document-picker",
      "op-sqlite",
      "@tanstack/react-query",
      "react-native-reanimated"
    ],
    commonArchitecture: "Offline-First Repository Pattern with local SQLite, Kanban drag-and-drop state, and background sync worker.",
    securityConsiderations: [
      "OAuth 2.0 corporate SSO",
      "Row Level Security (RLS) by sales team role",
      "Encrypted lead note storage"
    ],
    performanceConsiderations: [
      "Virtualized Kanban columns",
      "Fast fuzzy search over 10,000+ contacts using SQLite FTS5"
    ],
    offlineStrategy: "Full offline lead creation and stage updates; background queue reconciles with CRM backend when online.",
    monetizationStrategy: "Per-user monthly SaaS seat pricing, enterprise SSO add-on, advanced AI sales forecasting tier."
  },

  "Inventory": {
    category: "Inventory",
    typicalFeatures: [
      "Barcode & QR code scanner",
      "Stock count & location tracker",
      "Purchase order receiving",
      "Stock movement history",
      "Low-stock alert triggers"
    ],
    inferredCapabilities: [
      "High-Speed Camera Barcode Scanning",
      "Offline SQLite Database",
      "Thermal Printer Bluetooth Integration",
      "Haptic Feedback",
      "Audit Trail Log"
    ],
    recommendedServices: [
      "Supabase / Custom ERP",
      "Sentry",
      "Cloudflare R2"
    ],
    recommendedPackages: [
      "expo-camera",
      "expo-haptics",
      "op-sqlite",
      "react-native-mmkv",
      "@tanstack/react-query"
    ],
    commonArchitecture: "Hardware-Optimized Local-First Architecture built around high-throughput camera scanner loops and SQLite.",
    securityConsiderations: [
      "Role-based stock adjustment authorization",
      "Hardware device MAC binding",
      "Tamper-evident audit logs"
    ],
    performanceConsiderations: [
      "60fps camera frame scanner parser",
      "Instant local barcode lookup (<10ms via SQLite indexes)"
    ],
    offlineStrategy: "100% Offline Warehouse Mode: full product catalog stored on device; stock counts batch-synced via Wi-Fi dock.",
    monetizationStrategy: "B2B enterprise scanner licensing per warehouse device, ERP integration connectors."
  },

  "AI Assistant": {
    category: "AI Assistant",
    typicalFeatures: [
      "Conversational AI chat interface",
      "Voice dictation input",
      "Text-to-speech voice responses",
      "Markdown code formatting",
      "Prompt history & bookmarking"
    ],
    inferredCapabilities: [
      "Streaming Server-Sent Events (SSE)",
      "Voice Speech-to-Text",
      "Audio Player",
      "Markdown Tokenizer",
      "Local History Storage",
      "Secure API Key Vault"
    ],
    recommendedServices: [
      "Groq / OpenAI API",
      "ElevenLabs (Voice)",
      "Supabase",
      "PostHog",
      "Sentry"
    ],
    recommendedPackages: [
      "expo-audio",
      "expo-speech",
      "expo-crypto",
      "expo-secure-store",
      "react-native-markdown-display",
      "react-native-mmkv",
      "zustand"
    ],
    commonArchitecture: "Streaming SSE Event Loop Architecture with real-time UI token appending and local chat history persistence.",
    securityConsiderations: [
      "Client-side API key encryption via SecureStore",
      "Prompt injection sanitization",
      "Private chat mode toggle"
    ],
    performanceConsiderations: [
      "Fast markdown token rendering",
      "Zero memory leaks during long streaming responses",
      "Debounced local history writes"
    ],
    offlineStrategy: "Chat history and saved prompts fully readable offline; queued messages alert user when connectivity is absent.",
    monetizationStrategy: "Monthly pro subscription for unlimited AI tokens, access to premium LLM models (e.g. GPT-4o, Claude 3.5 Sonnet)."
  },

  "Expense Tracker": {
    category: "Expense Tracker",
    typicalFeatures: [
      "Expense logging & category tags",
      "Receipt camera scanning & OCR",
      "Monthly budget progress bar",
      "Export transactions to PDF/CSV",
      "Multi-currency support"
    ],
    inferredCapabilities: [
      "Camera OCR Processing",
      "Encrypted Local Database",
      "Interactive Chart Visualization",
      "Document Export",
      "Biometric Security",
      "Local Push Reminders"
    ],
    recommendedServices: [
      "Supabase",
      "RevenueCat",
      "Sentry"
    ],
    recommendedPackages: [
      "expo-camera",
      "expo-local-authentication",
      "expo-file-system",
      "expo-sharing",
      "op-sqlite",
      "@shopify/react-native-skia",
      "react-native-mmkv"
    ],
    commonArchitecture: "Privacy-First Local Hub Architecture with zero requirement for external servers unless cloud backup is enabled.",
    securityConsiderations: [
      "Biometric app lock",
      "AES-256 encrypted SQLite data file",
      "Local-only processing mode for receipts"
    ],
    performanceConsiderations: [
      "Instant expense insertion (<5ms)",
      "Fast month-over-month Skia chart updates",
      "Zero latency on startup"
    ],
    offlineStrategy: "100% Local App: all budget tracking and receipt processing functions without internet connection.",
    monetizationStrategy: "One-time lifetime purchase or annual pro tier for cloud backup, bank auto-sync, and unlimited OCR scans."
  },

  "Productivity": {
    category: "Productivity",
    typicalFeatures: [
      "Task lists & project boards",
      "Calendar view & reminders",
      "Tagging & subtask hierarchy",
      "Focus timer (Pomodoro)",
      "Cloud sync across devices"
    ],
    inferredCapabilities: [
      "Local Push Reminders",
      "Drag-and-Drop Reordering",
      "State Hydration",
      "Haptic Feedback",
      "Background Task Scheduler",
      "Calendar Sync"
    ],
    recommendedServices: [
      "Supabase / Firebase",
      "OneSignal",
      "RevenueCat"
    ],
    recommendedPackages: [
      "expo-notifications",
      "expo-calendar",
      "expo-haptics",
      "react-native-reanimated",
      "op-sqlite",
      "zustand",
      "@tanstack/react-query"
    ],
    commonArchitecture: "Local-First Modular Architecture with optimistic UI mutations, drag-and-drop list state, and background reminder manager.",
    securityConsiderations: [
      "Secure user data separation in multi-tenant setup",
      "Encrypted local task cache"
    ],
    performanceConsiderations: [
      "Smooth 60fps drag-and-drop animation using Reanimated v3",
      "Fast subtask tree traversal"
    ],
    offlineStrategy: "Local-First: full task creation, editing, reordering, and timer functions operate offline seamlessly.",
    monetizationStrategy: "Monthly premium subscription for unlimited project boards, team sharing, calendar integration, and custom themes."
  }
};
