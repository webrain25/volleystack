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
      sm: 'h-7 sm:h-8',
      md: 'h-9 sm:h-11 md:h-[44px]',
      lg: 'h-12 sm:h-14 md:h-16',
      xl: 'h-16 sm:h-20',
    },
    symbol: {
      sm: 'h-7 w-7 sm:h-8 sm:w-8',
      md: 'h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11',
      lg: 'h-12 w-12 sm:h-14 sm:w-14',
      xl: 'h-16 w-16 sm:h-20 sm:w-20',
    },
    vertical: {
      sm: 'h-16 sm:h-20',
      md: 'h-24 sm:h-28 md:h-32',
      lg: 'h-32 sm:h-40 md:h-48',
      xl: 'h-44 sm:h-56',
    },
  }[logoType][size];

  const logoSrc = {
    horizontal: isDark ? '/brand/VolleyStack_09_horizontal_dark.svg' : '/brand/VolleyStack_09_horizontal_color.svg',
    symbol: isDark ? '/brand/VolleyStack_09_symbol_dark.svg' : '/brand/VolleyStack_09_symbol_color.svg',
    vertical: isDark ? '/brand/VolleyStack_09_vertical_dark.svg' : '/brand/VolleyStack_09_vertical_color.svg',
  }[logoType];

  return (
    <div className={`inline-flex items-center select-none shrink-0 relative ${className}`}>
      {glow && (
        <div
          className="absolute -inset-1 bg-[#2A7EA2]/25 blur-md rounded-xl pointer-events-none -z-10"
          aria-hidden="true"
        />
      )}
      <img
        src={logoSrc}
        alt="VolleyStack"
        className={`${heightClasses} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );
}
