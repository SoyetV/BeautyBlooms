/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#b10e6b',
          'primary-container': '#d23284',
          'on-primary': '#ffffff',
          secondary: '#805618',
          'secondary-container': '#fec47d',
          'on-secondary': '#ffffff',
          tertiary: '#615a5f',
          'tertiary-container': '#7a7278',
          'on-tertiary': '#ffffff',
          background: '#fff7fa',
          'on-background': '#271528',
          surface: '#fff7fa',
          'on-surface': '#271528',
          'surface-variant': '#f7daf4',
          'on-surface-variant': '#574048',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#ffeffb',
          'surface-container': '#ffe7fb',
          'surface-container-high': '#fddffa',
          'surface-container-highest': '#f7daf4',
          'outline': '#8b7079',
          'outline-variant': '#debec8',
          error: '#ba1a1a',
          'on-error': '#ffffff',
        },
        // Retaining some semantic names but mapping to new colors
        bloom: {
          50: '#fff0f6',
          100: '#ffe3ec',
          200: '#ffcee0',
          300: '#fbb8d8',
          400: '#f687b3',
          500: '#ec4899', // From Stitch project thumbnail/design theme customColor
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        gold: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#4c2409',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        'full': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))',
      }
    },
  },
  plugins: [],
}
