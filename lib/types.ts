export type PackageCategory =
  | "Routing"
  | "Styling"
  | "Animations"
  | "Authentication"
  | "Location & Maps"
  | "Notifications"
  | "Data & Sync"
  | "Media"
  | "Payments"
  | "State"
  | "Storage"
  | "AI"
  | "Core";

/** Where a package is installed from. */
export type Installer = "expo" | "npm";

/** Package Importance Tier */
export type PackageTier = "Essential" | "Recommended" | "Optional";

export interface StackPackage {
  /** npm / expo package identifier, e.g. "expo-router" */
  name: string;
  /** High-level purpose */
  purpose?: string;
  /** Architect explanation of why it was selected */
  reason: string;
  /** Capability grouping */
  category: PackageCategory | PackageTier;
  /** Tier level: Essential | Recommended | Optional */
  tier?: PackageTier;
  /** `npx expo install` vs `npm install` */
  installer: Installer;
  /** Alternatives are optional and off by default */
  optional: boolean;
  /** Whether it starts included in the install command */
  defaultSelected: boolean;
  /** Expo SDK 52+ compatibility status */
  expoCompatibility?: string;
  /** Required configuration notes (app.json, plugin, permissions) */
  configNeeded?: string;
  /** Whether a plugin entry is required in app.json */
  hasConfigPlugin?: boolean;
  /** Alternative package options */
  alternatives?: string[];
  /** Official documentation URL */
  docUrl?: string;
}

export interface StackGroup {
  category: PackageCategory | PackageTier;
  packages: StackPackage[];
}

/** Output view mode */
export type OutputView = "structure" | "config";

export interface DetectedFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: "must-have" | "should-have" | "nice-to-have";
}

export interface InferredFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  justification: string;
  ommissionRisk: "Critical" | "High" | "Medium" | "Low";
}

export interface ArchitecturalRationale {
  domain: string;
  recommendation: string;
  reasons: string[];
  alternative: string;
  whenToUseAlternative: string;
}

export interface ArchitectureDecisionsData {
  pattern: {
    name: string;
    description: string;
    reasonForChoice: string;
  };
  stateStrategy: {
    clientState: string;
    serverState: string;
    formState: string;
    rationale: string;
  };
  dataPersistence: {
    primaryStorage: string;
    cacheLayer: string;
    syncEngine?: string;
  };
  routingModel: {
    framework: string;
    typeSafety: string;
    deepLinkingScheme: string;
  };
  offlineStrategy: {
    mode: string;
    queueEngine: string;
    conflictResolution: string;
  };
  securityModel: {
    secureStorage: string;
    authHeaderStrategy: string;
    biometricsEnabled: boolean;
  };
  tradeOffRationale: string[];
}

export interface CloudService {
  id: string;
  name: string;
  serviceType: string;
  provider: string;
  purpose: string;
  whyChosen: string;
  pricing: string;
  expoCompatibility: string;
  easeOfSetup: "Trivial" | "Moderate" | "Complex";
  productionSuitability: string;
  alternatives: string[];
  environmentVariableKeys: string[];
  docUrl: string;
}

export interface EnvironmentVariableItem {
  key: string;
  description: string;
  isPublic: boolean;
  required: boolean;
  exampleValue: string;
  stage: "development" | "staging" | "production" | "all";
}

export interface PermissionItem {
  permissionKey: string;
  platform: "ios" | "android" | "all";
  userPromptReason: string;
  configPluginRequired: boolean;
}

export interface RoadmapTask {
  id: string;
  task: string;
  category: "Setup" | "Frontend" | "Backend" | "Native/Config" | "Testing";
  deliverable: string;
}

export interface RoadmapPhaseItem {
  phaseNumber: number;
  title: string;
  description: string;
  estimatedDays: number;
  milestones: RoadmapTask[];
}

export interface ArchitectureEvaluationData {
  overallScore: number;
  scoreBreakdown: {
    scalability: number;
    maintainability: number;
    offlineResilience: number;
    securityGrade: number;
    developerVelocity: number;
  };
  complexity: {
    level: "Low" | "Medium" | "High" | "Enterprise";
    rating: number;
    keyDrivers: string[];
  };
  timeline: {
    estimatedTotalWeeks: number;
    estimatedDeveloperHours: number;
    recommendedTeamSize: string;
    phaseDurations: Record<string, string>;
  };
  risksAndMitigations: Array<{
    risk: string;
    impact: "High" | "Medium" | "Low";
    mitigationStrategy: string;
  }>;
}

export interface ExecutiveSummaryData {
  applicationType: string;
  complexity: string;
  estimatedDevTime: string;
  estimatedMonthlyCost: string;
  productionReadiness: string;
  readinessFlags: {
    offlineReady: boolean;
    authReady: boolean;
    paymentsReady: boolean;
    analyticsReady: boolean;
    notificationReady: boolean;
  };
  expoCompatibility: string;
  potentialRisks: string[];
  missingFeatures: string[];
  recommendedImprovements: string[];
}

export interface GeneratedStack {
  appName: string;
  displayName: string;
  summary: string;
  category?: string;
  archetype?: string;
  /** Packages grouped by capability or tier */
  groups: StackGroup[];
  /** Pre-rendered project tree (monospace) */
  folderStructure: string;
  /** Pre-rendered app.json (monospace, JSON) */
  appJson: string;
  defaultView: OutputView;
  /** True when produced by a live model rather than the local generator */
  source: "local" | "ai";

  // Architecture Dashboard Extension Fields
  executiveSummary?: ExecutiveSummaryData;
  detectedFeatures?: DetectedFeature[];
  inferredFeatures?: InferredFeature[];
  architectureDecisions?: ArchitectureDecisionsData;
  rationales?: ArchitecturalRationale[];
  cloudServices?: CloudService[];
  environmentVariables?: EnvironmentVariableItem[];
  permissions?: PermissionItem[];
  roadmap?: RoadmapPhaseItem[];
  evaluation?: ArchitectureEvaluationData;
}

export interface LoadingStep {
  label: string;
  duration: number;
}
