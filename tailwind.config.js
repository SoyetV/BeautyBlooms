/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in':       'fadeIn 0.6s ease-out forwards',
        'fade-in-up':    'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in-down':  'fadeInDown 0.5s ease-out forwards',
        'scale-in':      'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-right':'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'marquee':       'marquee 30s linear infinite',
        'shimmer':       'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      colors: {
  "error": "#ba1a1a",
  "on-tertiary-container": "#fffbff",
  "error-container": "#ffdad6",
  "secondary": "#805618",
  "on-primary-fixed": "#3e0022",
  "on-primary-container": "#fffbff",
  "on-error": "#ffffff",
  "tertiary-container": "#7a7278",
  "outline": "#8b7079",
  "on-tertiary-fixed": "#1f1a1e",
  "inverse-surface": "#3d2a3e",
  "primary-container": "#d23284",
  "on-secondary-fixed": "#2a1700",
  "tertiary": "#615a5f",
  "inverse-on-surface": "#ffebfb",
  "surface-bright": "#fff7fa",
  "surface-tint": "#b4136d",
  "primary": "#b10e6b",
  "on-tertiary": "#ffffff",
  "primary-fixed-dim": "#ffb0cd",
  "background": "#fff7fa",
  "surface-container-highest": "#f7daf4",
  "surface-container-low": "#ffeffb",
  "on-primary-fixed-variant": "#8c0053",
  "surface-variant": "#f7daf4",
  "secondary-container": "#fec47d",
  "tertiary-fixed-dim": "#cec4ca",
  "on-background": "#271528",
  "on-surface-variant": "#574048",
  "secondary-fixed-dim": "#f5bc75",
  "on-secondary-container": "#794f12",
  "surface-dim": "#eed1ec",
  "on-secondary": "#ffffff",
  "surface-container": "#ffe7fb",
  "tertiary-fixed": "#eae0e6",
  "inverse-primary": "#ffb0cd",
  "on-tertiary-fixed-variant": "#4b454a",
  "on-primary": "#ffffff",
  "outline-variant": "#debec8",
  "surface-container-high": "#fddffa",
  "surface-container-lowest": "#ffffff",
  "primary-fixed": "#ffd9e4",
  "on-secondary-fixed-variant": "#653e00",
  "secondary-fixed": "#ffddb7",
  "on-error-container": "#93000a",
  "surface": "#fff7fa",
  "on-surface": "#271528",
        /* ── Rose / Primary ── */
        rose: {
          25:  '#fff5f7',
          50:  '#fff1f4',
          100: '#ffe4ea',
          200: '#fecdd6',
          300: '#fda4b5',
          400: '#fb7093',
          500: '#f43f6e',
          600: '#e11d52',
          700: '#be123f',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        /* ── Blush / Surface tints ── */
        blush: {
          50:  '#fdf8f9',
          100: '#faeef1',
          200: '#f5dce3',
          300: '#ecc2cf',
          400: '#df9db3',
          500: '#cf7593',
          600: '#b85578',
          700: '#9a3d5f',
          800: '#7d3149',
          900: '#682a3d',
        },
        /* ── Champagne / Accent ── */
        champagne: {
          50:  '#fefcf5',
          100: '#fdf6e3',
          200: '#faecc1',
          300: '#f5db8e',
          400: '#efc45a',
          500: '#e8aa33',
          600: '#d08c22',
          700: '#ad6d1e',
          800: '#8c571e',
          900: '#73491d',
        },
        /* ── Stone / Neutrals ── */
        stone: {
          25:  '#fafaf9',
          50:  '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#0c0a09',
        },
        /* ── Charcoal / Deep neutrals ── */
        charcoal: {
          50:  '#f5f5f5',
          100: '#e1e1e1',
          200: '#c2c2c2',
          300: '#9b9b9b',
          400: '#707070',
          500: '#565656',
          600: '#3f3f3f',
          700: '#2b2b2b',
          800: '#1c1c1c',
          900: '#101010',
        },
        /* ── Petal / Light pinks ── */
        petal: {
          50:  '#fdf2f8',
          100: '#fbeaf3',
          200: '#f4d2e9',
          300: '#edadde',
          400: '#eaafce',
          500: '#dd82b7',
          600: '#c55f94',
          700: '#9f4b76',
          800: '#7a3a5a',
          900: '#5c2c44',
        },
        /* ── Bloom / Brand pinks ── */
        bloom: {
          50:  '#fff0f6',
          100: '#ffe3ec',
          200: '#ffcee0',
          300: '#fbb8d8',
          400: '#f687b3',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        /* ── Gold / Warm accents ── */
        gold: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#4c2409',
        },
        /* ── Sage / Supporting ── */
        sage: {
          100: '#ecf0ea',
          200: '#d5e0d1',
          300: '#b0c4aa',
          400: '#84a37b',
          500: '#5f8255',
          600: '#496642',
          700: '#3a5234',
          800: '#2f4229',
          900: '#273723',
        },
      },
      fontFamily: {
  "body-lg": [
    "Inter"
  ],
  "body-md": [
    "Inter"
  ],
  "headline-md": [
    "Playfair Display"
  ],
  "display-lg-mobile": [
    "Playfair Display"
  ],
  "headline-sm": [
    "Playfair Display"
  ],
  "accent-italic": [
    "Playfair Display"
  ],
  "display-lg": [
    "Playfair Display"
  ],
  "label-md": [
    "Inter"
  ],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      fontSize: {
  "body-lg": [
    "18px",
    {
      "lineHeight": "1.6",
      "fontWeight": "400"
    }
  ],
  "body-md": [
    "16px",
    {
      "lineHeight": "1.6",
      "fontWeight": "400"
    }
  ],
  "headline-md": [
    "32px",
    {
      "lineHeight": "1.3",
      "fontWeight": "600"
    }
  ],
  "display-lg-mobile": [
    "32px",
    {
      "lineHeight": "1.2",
      "fontWeight": "700"
    }
  ],
  "headline-sm": [
    "24px",
    {
      "lineHeight": "1.4",
      "fontWeight": "600"
    }
  ],
  "accent-italic": [
    "20px",
    {
      "lineHeight": "1.5",
      "fontWeight": "400"
    }
  ],
  "display-lg": [
    "48px",
    {
      "lineHeight": "1.2",
      "letterSpacing": "-0.02em",
      "fontWeight": "700"
    }
  ],
  "label-md": [
    "14px",
    {
      "lineHeight": "1.2",
      "letterSpacing": "0.05em",
      "fontWeight": "600"
    }
  ],
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:    ['0.75rem',  { lineHeight: '1.125rem' }],
        sm:    ['0.875rem', { lineHeight: '1.375rem' }],
        base:  ['1rem',     { lineHeight: '1.625rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.75rem' }],
        '5xl': ['3rem',     { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem',  { lineHeight: '4.25rem' }],
        '7xl': ['4.5rem',   { lineHeight: '5rem' }],
        '8xl': ['6rem',     { lineHeight: '1' }],
      },
      spacing: {
  "margin-desktop": "64px",
  "gutter": "24px",
  "margin-mobile": "16px",
  "container-max": "1280px",
  "base": "8px",
        '4.5':  '1.125rem',
        '13':   '3.25rem',
        '15':   '3.75rem',
        '18':   '4.5rem',
        '22':   '5.5rem',
        '26':   '6.5rem',
        '30':   '7.5rem',
        '34':   '8.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'xs':    '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card':  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 8px 24px -4px rgb(0 0 0 / 0.1), 0 2px 8px -2px rgb(0 0 0 / 0.06)',
        'rose':  '0 4px 24px -4px rgb(244 63 110 / 0.35)',
        'rose-lg': '0 8px 32px -4px rgb(244 63 110 / 0.4)',
        'float': '0 24px 48px -12px rgb(0 0 0 / 0.18)',
        'inner-top': 'inset 0 1px 0 0 rgb(255 255 255 / 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.4) 50%, transparent 100%)',
        'hero-mesh': `
          radial-gradient(at 20% 50%, rgb(244 63 110 / 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 20%, rgb(232 170 51 / 0.12) 0px, transparent 50%),
          radial-gradient(at 50% 80%, rgb(159 18 57 / 0.1) 0px, transparent 50%)
        `,
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      letterSpacing: {
        'widest2': '0.2em',
        'widest3': '0.3em',
      },
    },
  },
  plugins: [],
}