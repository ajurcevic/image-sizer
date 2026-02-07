interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className = "h-8 w-8" }: AppLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background rounded square */}
      <rect width="64" height="64" rx="14" fill="url(#logo-gradient)" />

      {/* Image icon (mountain/sun) */}
      <path
        d="M16 42l8-12 6 8 4-6 14 10H16z"
        fill="rgba(255,255,255,0.9)"
      />
      <circle cx="42" cy="22" r="5" fill="rgba(255,255,255,0.85)" />

      {/* Resize arrows (bottom-right corner) */}
      <path
        d="M44 36v12H32"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 48L36 40"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Size indicator lines */}
      <path
        d="M50 28v22M46 50h6"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
