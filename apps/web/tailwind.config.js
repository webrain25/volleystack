/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Keep or enforce dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F7FA', // text-primary
          100: '#E0E5EB',
          200: '#C2C9D6',
          300: '#A4B0C2',
          400: '#8E9AAD', // text-secondary
          500: '#596577', // text-tertiary
          600: '#2A3645',
          700: '#131E2C', // surface-hover
          800: '#0E1622', // surface
          900: '#0A1019', // bg-secondary
          950: '#060A11', // bg-primary
        },
        blue: {
          500: '#2D9CFF', // blue-bright
          600: '#1683FF', // main blue
        },
        accent: {
          500: '#FF861C', // orange
        },
        success: '#35C77B',
        danger: '#FF5964',
        warning: '#F1B649',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'orb': 'orb 14s infinite alternate',
      },
      keyframes: {
        orb: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(40px, -60px)' },
        }
      }
    },
  },
  plugins: [],
}
