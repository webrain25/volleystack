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
    sm: { w: 32, h: 32, textSize: 'text-base', gap: 'gap-2' },
    md: { w: 40, h: 40, textSize: 'text-xl', gap: 'gap-2.5' },
    lg: { w: 52, h: 52, textSize: 'text-2xl', gap: 'gap-3' },
    xl: { w: 64, h: 64, textSize: 'text-3xl', gap: 'gap-3.5' },
  }[size];

  return (
    <div className={`inline-flex items-center ${iconDimensions.gap} select-none ${className}`}>
      {/* Icon Mark */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
        style={{ width: iconDimensions.w, height: iconDimensions.h }}
      >
        {/* Soft Ambient Glow */}
        {glow && (
          <div
            className="absolute inset-0 rounded-2xl bg-[#00F59B]/25 blur-md -z-10 transition-opacity"
            aria-hidden="true"
          />
        )}

        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Primary Volt to Cyan Gradient */}
            <linearGradient id="vl-primary-grad" x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="60%" stopColor="#00F59B" />
              <stop offset="100%" stopColor="#00DF89" />
            </linearGradient>

            {/* Background Gradient */}
            <linearGradient id="vl-bg-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F1728" />
              <stop offset="100%" stopColor="#060A12" />
            </linearGradient>
          </defs>

          {/* Squircle Dark Container */}
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="16"
            fill="url(#vl-bg-grad)"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />

          {/* Inner Accent Ring */}
          <rect
            x="3.5"
            y="3.5"
            width="57"
            height="57"
            rx="14.5"
            stroke="url(#vl-primary-grad)"
            strokeWidth="1"
            strokeOpacity="0.3"
          />

          {/* Stylized Volleyball Sphere */}
          <g id="volleyball-sphere">
            <circle
              cx="32"
              cy="21"
              r="9.5"
              fill="#080E1A"
              stroke="url(#vl-primary-grad)"
              strokeWidth="2.2"
            />
            {/* Curved Volleyball Seam 1 */}
            <path
              d="M 32 11.5 C 34 16, 38 19, 41.2 22"
              stroke="url(#vl-primary-grad)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Curved Volleyball Seam 2 */}
            <path
              d="M 23 18 C 28 20, 31 25, 32 30.5"
              stroke="url(#vl-primary-grad)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Curved Volleyball Seam 3 */}
            <path
              d="M 24 25 C 29 27, 36 27, 40 28"
              stroke="#00E5FF"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
          </g>

          {/* Kinetic "V" Upper Wing */}
          <path
            d="M 14 26 L 32 47 L 50 26"
            stroke="url(#vl-primary-grad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* "Stack" Lower Kinetic Chevron */}
          <path
            d="M 21 44 L 32 54 L 43 44"
            stroke="url(#vl-primary-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.85"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center tracking-tight leading-none font-black">
          <span className={`text-text-primary ${iconDimensions.textSize}`}>
            VOLLEY
          </span>
          <span className={`ml-1 bg-gradient-to-r from-[#00F59B] via-[#22FFAB] to-[#00DF89] bg-clip-text text-transparent ${iconDimensions.textSize}`}>
            STACK
          </span>
        </div>
      )}
    </div>
  );
}
