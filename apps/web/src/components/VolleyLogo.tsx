interface VolleyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export default function VolleyLogo({
  size = 'md',
  showText = true,
  className = '',
  glow = true,
}: VolleyLogoProps) {
  const iconDimensions = {
    sm: { w: 32, h: 32, textSize: 'text-base', badge: 'text-[9px] px-1 py-0.2' },
    md: { w: 40, h: 40, textSize: 'text-xl', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { w: 50, h: 50, textSize: 'text-2xl', badge: 'text-[11px] px-2 py-0.5' },
    xl: { w: 64, h: 64, textSize: 'text-3xl', badge: 'text-xs px-2.5 py-1' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Icon Mark */}
      <div
        className="relative flex items-center justify-center transition-transform duration-300 hover:scale-105"
        style={{ width: iconDimensions.w, height: iconDimensions.h }}
      >
        {/* Ambient Neon Glow */}
        {glow && (
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#00F59B] to-[#00BBF9] opacity-35 blur-md -z-10 group-hover:opacity-60 transition-opacity"
            aria-hidden="true"
          />
        )}

        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_10px_rgba(0,245,155,0.35)]"
        >
          <defs>
            {/* Linear Gradient for Main V Wings */}
            <linearGradient id="vs-volt-grad" x1="4" y1="8" x2="60" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22FFAB" />
              <stop offset="50%" stopColor="#00F59B" />
              <stop offset="100%" stopColor="#00A86B" />
            </linearGradient>

            {/* Cyan/Volt Accent Gradient */}
            <linearGradient id="vs-accent-grad" x1="16" y1="12" x2="48" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#00F59B" />
            </linearGradient>

            {/* Deep Obsidian Background Gradient */}
            <linearGradient id="vs-bg-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0E1626" />
              <stop offset="100%" stopColor="#05080E" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="vs-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#00F59B" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Squircle Glass Outer Base */}
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="16"
            fill="url(#vs-bg-grad)"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />

          {/* Inner Subtle Ring */}
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="14"
            stroke="url(#vs-volt-grad)"
            strokeWidth="0.75"
            strokeOpacity="0.3"
          />

          {/* Volleyball Kinetic Lines (Top-Right Arc) */}
          <path
            d="M 38 14 C 44 16, 50 22, 51 28"
            stroke="url(#vs-accent-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 3"
            opacity="0.85"
          />

          {/* Dynamic Volleyball Sphere Accent */}
          <g transform="translate(32, 18)">
            <circle cx="8" cy="4" r="8.5" fill="#0E1726" stroke="url(#vs-volt-grad)" strokeWidth="1.75" />
            {/* Seams */}
            <path
              d="M 2.5 1 C 5 4, 11 4, 13.5 1"
              stroke="#00F59B"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 8 -4.5 C 7 -1, 7 5, 8 12.5"
              stroke="#00E5FF"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M 2.5 7 C 5 4, 11 4, 13.5 7"
              stroke="#00F59B"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Bold Kinetic "V" Spiker Wings */}
          {/* Left Wing (Thick attack stroke) */}
          <path
            d="M 12 18 L 26 48 L 32 48 L 22 18 Z"
            fill="url(#vs-volt-grad)"
            filter="url(#vs-glow)"
          />

          {/* Right Wing (Speed cut with Stack Bars) */}
          <path
            d="M 26 48 L 46 22 L 40 22 L 23 44 Z"
            fill="url(#vs-accent-grad)"
          />

          {/* Kinetic Spike Trail / Stack Layers */}
          <path
            d="M 16 33 L 30 48 L 34 46 L 22 33 Z"
            fill="#00F59B"
            opacity="0.6"
          />

          {/* Sharp Apex Highlight Point */}
          <circle cx="28" cy="49" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight text-text-primary ${iconDimensions.textSize}`}
            style={{ letterSpacing: '-0.03em' }}
          >
            VOLLEY
          </span>
          <span
            className={`font-black tracking-tight bg-gradient-to-r from-[#00F59B] via-[#22FFAB] to-[#00DF89] bg-clip-text text-transparent ${iconDimensions.textSize}`}
            style={{ letterSpacing: '-0.03em' }}
          >
            STACK
          </span>
          <span
            className={`ml-1 font-extrabold uppercase rounded-md bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] tracking-wider ${iconDimensions.badge}`}
          >
            PRO
          </span>
        </div>
      )}
    </div>
  );
}
