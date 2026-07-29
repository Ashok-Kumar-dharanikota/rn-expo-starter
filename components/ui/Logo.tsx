interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Abstract, Expo-inspired mark — an interlocking aperture that adapts to the
 * active theme. Original geometry (not the Expo trademark).
 */
export function Logo({ size = 26, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="Expo Init AI logo"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        className="fill-surface-raised stroke-line"
      />
      <path
        d="M16 7.5c.9 0 1.7.48 2.14 1.26l5.9 10.5A2.46 2.46 0 0 1 21.9 23h-2.03l-3.87-7.1L12.13 23H10.1a2.46 2.46 0 0 1-2.14-3.74l5.9-10.5A2.46 2.46 0 0 1 16 7.5Z"
        className="fill-accent"
      />
      <circle cx="16" cy="16.4" r="1.9" className="fill-surface-raised" />
    </svg>
  );
}
