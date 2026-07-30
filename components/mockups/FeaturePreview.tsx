"use client";

import {
  BarChart3,
  Bell,
  Camera,
  CreditCard,
  Fingerprint,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import type { SceneId } from "@/lib/capabilities";

/** A phone chrome that hosts an animated scene. */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[248px]">
      <div className="relative aspect-[9/19] overflow-hidden rounded-[28px] border border-line-strong bg-canvas shadow-panel">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 h-4 w-20 -translate-x-1/2 rounded-full bg-canvas-raised" />
        {/* Status bar */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-2.5 text-[8px] font-medium text-content-subtle">
          <span>9:41</span>
          <span className="h-1.5 w-4 rounded-[2px] border border-content-subtle/60" />
        </div>
        <div className="absolute inset-0 pt-9">{children}</div>
      </div>
    </div>
  );
}

function Bar({ label }: { label: string }) {
  return (
    <div className="mb-2 flex items-center gap-2 px-4">
      <span className="h-4 w-4 rounded-md bg-accent/20" />
      <span className="text-[10px] font-semibold text-content">{label}</span>
    </div>
  );
}

function AuthScene() {
  return (
    <div className="flex h-full flex-col items-center px-5">
      <Bar label="Sign in" />
      <div className="relative mt-8 flex h-24 w-24 items-center justify-center">
        <span className="mk-ring absolute inset-0 rounded-full border border-accent" />
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-surface">
          <Fingerprint className="h-8 w-8 text-accent" />
        </span>
        <span className="mk-scan absolute left-2 right-2 h-px bg-accent" />
      </div>
      <p className="mt-5 text-[10px] text-content-muted">Face ID to continue</p>
      <div className="mt-auto mb-6 w-full space-y-2">
        <div className="h-8 rounded-md border border-line bg-surface" />
        <div className="flex h-8 items-center justify-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground">
          Continue
        </div>
      </div>
    </div>
  );
}

function PaymentsScene() {
  return (
    <div className="relative flex h-full flex-col px-4">
      <Bar label="Checkout" />
      <div className="space-y-2">
        <div className="h-10 rounded-md border border-line bg-surface/60" />
        <div className="h-10 rounded-md border border-line bg-surface/60" />
      </div>
      {/* Payment sheet */}
      <div className="mk-rise absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-line bg-surface-raised px-4 pb-5 pt-4">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong" />
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-content">Total</span>
          <span className="text-[11px] font-bold text-content">$24.00</span>
        </div>
        <div className="mb-2 flex h-9 items-center gap-2 rounded-md border border-line bg-canvas px-2">
          <CreditCard className="h-3.5 w-3.5 text-content-subtle" />
          <span className="text-[9px] text-content-muted">•••• 4242</span>
          <span className="mk-pop ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-success text-success-foreground">
            ✓
          </span>
        </div>
        <div className="flex h-9 items-center justify-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground">
           Pay
        </div>
      </div>
    </div>
  );
}

function DatabaseScene() {
  return (
    <div className="flex h-full flex-col px-4">
      <Bar label="Sync" />
      <div className="mt-2 flex items-center justify-between">
        <div className="space-y-1.5">
          <span className="block text-[8px] text-content-subtle">DEVICE</span>
          <div className="h-2 w-16 rounded bg-line" />
          <div className="h-2 w-12 rounded bg-line" />
          <div className="h-2 w-14 rounded bg-line" />
        </div>
        <div className="relative mx-2 h-8 flex-1">
          <span className="mk-sync absolute top-1 h-1.5 w-1.5 rounded-full bg-accent" />
          <span
            className="mk-sync absolute top-4 h-1.5 w-1.5 rounded-full bg-accent"
            style={{ animationDelay: "0.7s" }}
          />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-surface">
          <span className="text-[8px] font-semibold text-content-muted">
            CLOUD
          </span>
        </div>
      </div>
      <div className="mt-auto mb-6 flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        <span className="text-[9px] font-medium text-success">
          Offline-ready · synced
        </span>
      </div>
    </div>
  );
}

function NotificationsScene() {
  return (
    <div className="relative flex h-full flex-col px-4">
      <Bar label="Home" />
      <div className="space-y-2 opacity-60">
        <div className="h-12 rounded-md border border-line bg-surface/50" />
        <div className="h-12 rounded-md border border-line bg-surface/50" />
      </div>
      <div className="mk-drop absolute inset-x-3 top-10 flex items-center gap-2 rounded-xl border border-line bg-surface-raised px-3 py-2.5 shadow-panel">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent">
          <Bell className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[9px] font-semibold text-content">
            New order nearby
          </span>
          <span className="block truncate text-[8px] text-content-muted">
            Tap to accept before it&rsquo;s gone
          </span>
        </span>
      </div>
    </div>
  );
}

function MapsScene() {
  return (
    <div className="flex h-full flex-col">
      <Bar label="Nearby" />
      <div className="relative mx-4 mt-1 flex-1 overflow-hidden rounded-lg border border-line bg-surface/40">
        {/* faux roads */}
        <div className="absolute left-6 top-0 h-full w-px bg-line" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-line" />
        <div className="absolute right-8 top-0 h-full w-px bg-line" />
        {/* route */}
        <svg className="absolute inset-0 h-full w-full" fill="none">
          <path
            d="M30 150 C60 90 110 120 150 40"
            stroke="rgb(var(--accent))"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>
        {/* pin + ping */}
        <div className="absolute left-[52%] top-[24%]">
          <span className="mk-ping absolute -left-2 -top-2 h-8 w-8 rounded-full bg-accent/30" />
          <span className="mk-pin block">
            <MapPin className="h-5 w-5 text-accent" fill="currentColor" />
          </span>
        </div>
      </div>
      <div className="m-4 h-8 rounded-md bg-primary/90" />
    </div>
  );
}

function CameraScene() {
  return (
    <div className="relative flex h-full flex-col">
      <Bar label="Scan" />
      <div className="relative mx-4 mt-1 flex-1 overflow-hidden rounded-lg border border-line bg-black/40">
        <span className="mk-flash absolute inset-0 bg-white" />
        {/* corner brackets */}
        <span className="absolute left-6 top-8 h-6 w-6 border-l-2 border-t-2 border-accent" />
        <span className="absolute right-6 top-8 h-6 w-6 border-r-2 border-t-2 border-accent" />
        <span className="absolute bottom-16 left-6 h-6 w-6 border-b-2 border-l-2 border-accent" />
        <span className="absolute bottom-16 right-6 h-6 w-6 border-b-2 border-r-2 border-accent" />
        <span className="mk-scan absolute inset-x-8 top-1/2 h-px bg-accent" />
      </div>
      <div className="my-4 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-content">
          <Camera className="h-5 w-5 text-content" />
        </span>
      </div>
    </div>
  );
}

function ChatScene() {
  return (
    <div className="flex h-full flex-col px-4">
      <Bar label="Messages" />
      <div className="mt-1 flex-1 space-y-2">
        <div
          className="mk-bubble max-w-[70%] rounded-2xl rounded-tl-sm bg-surface px-3 py-2 text-[9px] text-content"
          style={{ animationDelay: "0.1s" }}
        >
          Hey! Are we still on?
        </div>
        <div
          className="mk-bubble ml-auto max-w-[70%] rounded-2xl rounded-tr-sm bg-accent px-3 py-2 text-[9px] text-accent-foreground"
          style={{ animationDelay: "0.7s" }}
        >
          Yes — omw now 🚗
        </div>
        <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface px-3 py-2.5 w-12">
          <span className="mk-typing h-1.5 w-1.5 rounded-full bg-content-subtle" />
          <span
            className="mk-typing h-1.5 w-1.5 rounded-full bg-content-subtle"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="mk-typing h-1.5 w-1.5 rounded-full bg-content-subtle"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
      <div className="mb-6 h-8 rounded-full border border-line bg-surface" />
    </div>
  );
}

function AiScene() {
  return (
    <div className="flex h-full flex-col px-4">
      <Bar label="Assistant" />
      <div className="mt-1 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-accent" />
        <span className="text-[9px] font-medium text-accent">Thinking…</span>
      </div>
      <div className="mt-3 space-y-2">
        {[80, 64, 72, 48].map((w, i) => (
          <span
            key={i}
            className="mk-stream block h-2 rounded bg-line"
            style={{ width: `${w}%`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>
      <div className="mt-auto mb-6 flex h-8 items-center rounded-full border border-line bg-surface px-3 text-[9px] text-content-subtle">
        Ask anything…
      </div>
    </div>
  );
}

function AnalyticsScene() {
  return (
    <div className="flex h-full flex-col px-4">
      <Bar label="Insights" />
      <div className="mt-1 rounded-md border border-line bg-surface/40 p-3">
        <span className="text-[8px] text-content-subtle">ACTIVE USERS</span>
        <p className="text-sm font-bold text-content">12,480</p>
        <span className="text-[8px] font-medium text-success">▲ 18.2%</span>
      </div>
      <div className="mt-4 flex h-24 items-end justify-between gap-1.5 px-1">
        {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
          <span
            key={i}
            className="mk-bar flex-1 rounded-sm bg-accent/70"
            style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function MediaScene() {
  return (
    <div className="flex h-full flex-col px-4">
      <Bar label="Gallery" />
      <div className="mt-1 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="mk-fade-seq aspect-square rounded-md bg-surface-raised"
            style={{ animationDelay: `${(i % 5) * 0.25}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function GenericScene() {
  return (
    <div className="flex h-full flex-col px-4">
      <Bar label="Your App" />
      <div className="mt-1 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="mk-fade-seq flex items-center gap-2 rounded-md border border-line bg-surface/40 p-2"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <span className="h-6 w-6 rounded-md bg-accent/15" />
            <span className="space-y-1">
              <span className="block h-1.5 w-20 rounded bg-line" />
              <span className="block h-1.5 w-12 rounded bg-line" />
            </span>
          </div>
        ))}
      </div>
      {/* tab bar */}
      <div className="mt-auto mb-3 flex items-center justify-around border-t border-line pt-2">
        <MessageSquare className="h-3.5 w-3.5 text-accent" />
        <BarChart3 className="h-3.5 w-3.5 text-content-subtle" />
        <Bell className="h-3.5 w-3.5 text-content-subtle" />
      </div>
    </div>
  );
}

const SCENES: Record<SceneId, () => React.JSX.Element> = {
  auth: AuthScene,
  payments: PaymentsScene,
  database: DatabaseScene,
  notifications: NotificationsScene,
  maps: MapsScene,
  camera: CameraScene,
  chat: ChatScene,
  ai: AiScene,
  analytics: AnalyticsScene,
  media: MediaScene,
  generic: GenericScene,
};

interface FeaturePreviewProps {
  scene: SceneId;
  label: string;
  description: string;
}

export function FeaturePreview({
  scene,
  label,
  description,
}: FeaturePreviewProps) {
  const Scene = SCENES[scene] ?? GenericScene;
  return (
    <div className="rounded-lg border border-line bg-canvas-raised p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-content-subtle">
          Live preview
        </span>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10.5px] font-medium text-accent">
          {label}
        </span>
      </div>
      <div key={scene} className="animate-fade-in">
        <Phone>
          <Scene />
        </Phone>
      </div>
      <p className="mx-auto mt-4 max-w-[240px] text-center text-[12px] leading-relaxed text-content-muted">
        {description}
      </p>
    </div>
  );
}
