import { useThemeStore } from '../store/useThemeStore';

interface VolleyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'horizontal' | 'vertical' | 'symbol';
  className?: string;
  glow?: boolean;
}

export default function VolleyLogo({
  size = 'md',
  showText = true,
  variant,
  className = '',
  glow = false,
}: VolleyLogoProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Determine which official Brand Kit asset to use
  const logoType = variant || (showText ? 'horizontal' : 'symbol');

  // Height scaling per size and variant (44px official recommended height for standard header)
  const heightClasses = {
    horizontal: {
      sm: 'h-5 sm:h-6',
      md: 'h-6 sm:h-8 md:h-[38px]',
      lg: 'h-7 sm:h-10 md:h-13',
      xl: 'h-10 sm:h-14 md:h-18',
    },
    symbol: {
      sm: 'h-6 w-6 sm:h-7 sm:w-7',
      md: 'h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10',
      lg: 'h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14',
      xl: 'h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20',
    },
    vertical: {
      sm: 'h-12 sm:h-16',
      md: 'h-16 sm:h-22 md:h-26',
      lg: 'h-20 sm:h-28 md:h-36',
      xl: 'h-28 sm:h-40',
    },
  }[logoType][size];

  const logoSrc = {
    horizontal: isDark ? '/brand/VolleyStack_09_horizontal_dark.png' : '/brand/VolleyStack_09_horizontal_color.png',
    symbol: isDark ? '/brand/VolleyStack_09_symbol_dark.png' : '/brand/VolleyStack_09_symbol_color.png',
    vertical: isDark ? '/brand/VolleyStack_09_vertical_dark.png' : '/brand/VolleyStack_09_vertical_color.png',
  }[logoType];

  return (
    <div className={`inline-flex items-center select-none shrink-0 relative max-w-full ${className}`}>
      {glow && (
        <div
          className="absolute -inset-1 bg-[#2A7EA2]/25 blur-md rounded-xl pointer-events-none -z-10"
          aria-hidden="true"
        />
      )}
      <img
        src={logoSrc}
        alt="VolleyStack"
        className={`${heightClasses} w-auto max-w-full object-contain transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );
}
