/**
 * Ambient, drifting app-mockup wireframes rendered behind the hero.
 * Purely decorative, monochrome, and low-opacity so it never competes
 * with foreground content. Motion is disabled under prefers-reduced-motion.
 */

type Variant = "list" | "map" | "feed" | "profile";

function PhoneWireframe({ variant }: { variant: Variant }) {
  const stroke = "rgb(var(--content) / 0.9)";
  const faint = "rgb(var(--content) / 0.5)";
  return (
    <svg
      viewBox="0 0 160 320"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      {/* Device frame */}
      <rect
        x="2"
        y="2"
        width="156"
        height="316"
        rx="24"
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* Notch */}
      <rect x="60" y="10" width="40" height="6" rx="3" fill={faint} />

      {variant === "list" && (
        <>
          <rect x="16" y="30" width="70" height="10" rx="3" fill={faint} />
          <rect x="16" y="52" width="128" height="34" rx="8" stroke={faint} />
          <rect x="16" y="94" width="128" height="34" rx="8" stroke={faint} />
          <rect x="16" y="136" width="128" height="34" rx="8" stroke={faint} />
          <rect x="16" y="178" width="128" height="34" rx="8" stroke={faint} />
        </>
      )}
      {variant === "map" && (
        <>
          <rect x="12" y="28" width="136" height="180" rx="10" stroke={faint} />
          <path
            d="M30 190 C60 120, 100 150, 132 60"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle cx="30" cy="190" r="4" fill={stroke} />
          <circle cx="132" cy="60" r="4" fill={stroke} />
          <rect x="16" y="222" width="128" height="30" rx="8" stroke={faint} />
        </>
      )}
      {variant === "feed" && (
        <>
          <circle cx="30" cy="44" r="10" stroke={faint} />
          <rect x="48" y="38" width="60" height="6" rx="3" fill={faint} />
          <rect x="48" y="50" width="40" height="5" rx="2.5" fill={faint} />
          <rect x="16" y="70" width="128" height="80" rx="8" stroke={faint} />
          <rect x="16" y="160" width="90" height="7" rx="3" fill={faint} />
          <rect x="16" y="174" width="128" height="6" rx="3" fill={faint} />
        </>
      )}
      {variant === "profile" && (
        <>
          <circle cx="80" cy="60" r="24" stroke={stroke} strokeWidth="1.5" />
          <rect x="52" y="96" width="56" height="8" rx="4" fill={faint} />
          <rect x="40" y="126" width="80" height="26" rx="13" stroke={faint} />
          <rect x="16" y="168" width="60" height="42" rx="8" stroke={faint} />
          <rect x="84" y="168" width="60" height="42" rx="8" stroke={faint} />
        </>
      )}

      {/* Tab bar */}
      <line x1="2" y1="286" x2="158" y2="286" stroke={faint} />
      <circle cx="40" cy="302" r="4" fill={faint} />
      <circle cx="80" cy="302" r="4" fill={stroke} />
      <circle cx="120" cy="302" r="4" fill={faint} />
    </svg>
  );
}

const FRAMES: {
  variant: Variant;
  className: string;
  anim: string;
  delay: string;
}[] = [
  {
    variant: "list",
    className: "left-[-40px] top-[40px] w-[150px] rotate-[-8deg]",
    anim: "animate-drift-a",
    delay: "0s",
  },
  {
    variant: "map",
    className: "right-[-30px] top-[20px] w-[168px] rotate-[7deg]",
    anim: "animate-drift-b",
    delay: "-3s",
  },
  {
    variant: "feed",
    className: "left-[10%] top-[220px] hidden w-[128px] rotate-[5deg] lg:block",
    anim: "animate-drift-c",
    delay: "-6s",
  },
  {
    variant: "profile",
    className:
      "right-[8%] top-[240px] hidden w-[132px] rotate-[-6deg] lg:block",
    anim: "animate-drift-a",
    delay: "-9s",
  },
];

export function WireframeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden mask-fade-b"
    >
      <div className="relative mx-auto h-full max-w-6xl">
        {FRAMES.map((frame, i) => (
          <div
            key={i}
            className={`absolute opacity-[0.06] dark:opacity-[0.08] ${frame.className} ${frame.anim}`}
            style={{ animationDelay: frame.delay }}
          >
            <PhoneWireframe variant={frame.variant} />
          </div>
        ))}
      </div>
    </div>
  );
}
