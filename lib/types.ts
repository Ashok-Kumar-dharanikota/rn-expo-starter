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

export interface StackPackage {
  /** npm / expo package identifier, e.g. "expo-router" */
  name: string;
  /** Capability grouping */
  category: PackageCategory;
  /** Concise, human explanation of why it was selected */
  reason: string;
  /** `npx expo install` vs `npm install` */
  installer: Installer;
  /** Alternatives are optional and off by default */
  optional: boolean;
  /** Whether it starts included in the install command */
  defaultSelected: boolean;
}

export interface StackGroup {
  category: PackageCategory;
  packages: StackPackage[];
}

/** The right-hand terminal can show either a file tree or an app.json */
export type OutputView = "structure" | "config";

export interface GeneratedStack {
  appName: string;
  displayName: string;
  summary: string;
  /** Packages grouped by capability */
  groups: StackGroup[];
  /** Pre-rendered project tree (monospace) */
  folderStructure: string;
  /** Pre-rendered app.json (monospace, JSON) */
  appJson: string;
  defaultView: OutputView;
  /** True when produced by a live model rather than the local generator */
  source: "local" | "ai";
}

export interface LoadingStep {
  label: string;
  duration: number;
}
