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
    sm: { w: 34, h: 34, rounded: 'rounded-lg', textSize: 'text-base', gap: 'gap-2.5' },
    md: { w: 42, h: 42, rounded: 'rounded-xl', textSize: 'text-xl', gap: 'gap-3' },
    lg: { w: 56, h: 56, rounded: 'rounded-2xl', textSize: 'text-2xl', gap: 'gap-3.5' },
    xl: { w: 68, h: 68, rounded: 'rounded-2xl', textSize: 'text-3xl', gap: 'gap-4' },
  }[size];

  return (
    <div className={`inline-flex items-center ${iconDimensions.gap} select-none ${className}`}>
      {/* Icon Mark using the official user-provided logo */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${iconDimensions.rounded} overflow-hidden shadow-[0_0_20px_rgba(0,245,155,0.3)] border border-white/10 transition-transform duration-200 hover:scale-105`}
        style={{ width: iconDimensions.w, height: iconDimensions.h }}
      >
        {glow && (
          <div
            className="absolute inset-0 bg-[#00F59B]/20 blur-sm pointer-events-none -z-10"
            aria-hidden="true"
          />
        )}
        <img
          src="/logo.jpg"
          alt="VolleyStack Logo"
          className="w-full h-full object-cover"
        />
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
