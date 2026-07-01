/**
 * BeautyBlooms — Modern Flora design system
 *
 * Token architecture (3 layers):
 *   1. Primitive  → CSS custom properties in src/index.css :root
 *   2. Semantic   → Tailwind theme.extend.colors below (reference primitives)
 *   3. Component  → .btn-*, .card, .input-field, .label classes in src/index.css @layer components
 *
 * Aesthetic: Modern Flora
 *   - Cream bg / deep plum text / bloom pink primary / gold accent / sage tertiary
 *   - Playfair Display (display) + Inter (body) + JetBrains Mono (prices, tokens)
 *   - Motion intensity 5/10 (micro-interactions, single marquee, scroll reveal)
 *   - Surfaces: opaque 90%, glass only on drawer/modal/sticky nav
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // ──────────────────────────────────────────────────────────────────
      // 1. SEMANTIC COLORS (reference primitive CSS vars in :root)
      // ──────────────────────────────────────────────────────────────────
      colors: {
        // Brand — Bloom pink (single accent, used sparingly per taste-skill §4.2)
        primary: {
          DEFAULT: 'var(--color-bloom-500)',
          50:      'var(--color-bloom-50)',
          100:     'var(--color-bloom-100)',
          200:     'var(--color-bloom-200)',
          300:     'var(--color-bloom-300)',
          400:     'var(--color-bloom-400)',
          500:     'var(--color-bloom-500)',
          600:     'var(--color-bloom-600)',
          700:     'var(--color-bloom-700)',
          800:     'var(--color-bloom-800)',
          900:     'var(--color-bloom-900)',
        },
        // Gold accent (premium signifiers, secondary CTAs)
        accent: {
          DEFAULT: 'var(--color-gold-500)',
          50:      'var(--color-gold-50)',
          100:     'var(--color-gold-100)',
          200:     'var(--color-gold-200)',
          300:     'var(--color-gold-300)',
          400:     'var(--color-gold-400)',
          500:     'var(--color-gold-500)',
          600:     'var(--color-gold-600)',
          700:     'var(--color-gold-700)',
          800:     'var(--color-gold-800)',
          900:     'var(--color-gold-900)',
        },
        // Sage tertiary (success states, "fresh" indicators)
        sage: {
          DEFAULT: 'var(--color-sage-500)',
          50:      'var(--color-sage-50)',
          100:     'var(--color-sage-100)',
          200:     'var(--color-sage-200)',
          300:     'var(--color-sage-300)',
          400:     'var(--color-sage-400)',
          500:     'var(--color-sage-500)',
          600:     'var(--color-sage-600)',
          700:     'var(--color-sage-700)',
          800:     'var(--color-sage-800)',
          900:     'var(--color-sage-900)',
        },

        // Surfaces & text
        background:    'var(--color-bg)',
        surface:       'var(--color-surface)',
        'surface-2':   'var(--color-surface-2)',  // slightly raised
        'surface-3':   'var(--color-surface-3)',  // card surface
        foreground:    'var(--color-fg)',
        muted:         'var(--color-fg-muted)',
        subtle:        'var(--color-fg-subtle)',
        border:        'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',

        // States
        error: {
          DEFAULT: 'var(--color-error)',
          soft:    'var(--color-error-soft)',
          fg:      'var(--color-error-fg)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          soft:    'var(--color-success-soft)',
          fg:      'var(--color-success-fg)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          soft:    'var(--color-warning-soft)',
          fg:      'var(--color-warning-fg)',
        },

        // ────────────────────────────────────────────────────────────────
        // LEGACY ALIASES — back-compat with Phase-0 components still using
        // the original Material-3 / Petal-Gilded token names.
        // These map old names → new tokens. Will be removed at the end of
        // Phase 2 once all components have migrated to the new system.
        // ────────────────────────────────────────────────────────────────
        'on-primary':            '#ffffff',
        'on-primary-container':  '#ffffff',
        'primary-container':     'var(--color-bloom-400)',
        'primary-fixed':         'var(--color-bloom-100)',
        'primary-fixed-dim':     'var(--color-bloom-300)',
        'on-primary-fixed':      'var(--color-bloom-900)',
        'on-primary-fixed-variant': 'var(--color-bloom-700)',

        'on-secondary':          '#ffffff',
        'on-secondary-container':'var(--color-gold-800)',
        'secondary-container':   'var(--color-gold-300)',
        'secondary-fixed':       'var(--color-gold-100)',
        'secondary-fixed-dim':   'var(--color-gold-300)',
        'on-secondary-fixed':    'var(--color-gold-900)',
        'on-secondary-fixed-variant': 'var(--color-gold-700)',

        'tertiary':              'var(--color-fg-muted)',
        'tertiary-container':    'var(--color-surface-2)',
        'tertiary-fixed':        'var(--color-surface-2)',
        'tertiary-fixed-dim':    'var(--color-surface-2)',
        'on-tertiary':           '#ffffff',
        'on-tertiary-container': 'var(--color-fg)',
        'on-tertiary-fixed':     'var(--color-fg)',
        'on-tertiary-fixed-variant': 'var(--color-fg-muted)',

        'on-error':              '#ffffff',
        'on-error-container':    'var(--color-error-fg)',
        'error-container':       'var(--color-error-soft)',

        'on-background':         'var(--color-fg)',
        'on-surface':            'var(--color-fg)',
        'on-surface-variant':    'var(--color-fg-muted)',
        'surface-bright':        'var(--color-surface)',
        'surface-dim':           'var(--color-surface-2)',
        'surface-tint':          'var(--color-bloom-500)',
        'surface-variant':       'var(--color-surface-2)',
        'surface-container-lowest': 'var(--color-surface)',
        'surface-container-low':    'var(--color-surface)',
        'surface-container':        'var(--color-surface)',
        'surface-container-high':   'var(--color-surface-2)',
        'surface-container-highest':'var(--color-surface-2)',

        'outline':               'var(--color-border-strong)',
        'outline-variant':       'var(--color-border)',

        'inverse-surface':       'var(--color-fg)',
        'inverse-on-surface':    'var(--color-bg)',
        'inverse-primary':       'var(--color-bloom-300)',
      },

      // ──────────────────────────────────────────────────────────────────
      // 2. TYPOGRAPHY
      // ──────────────────────────────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],

        // Legacy aliases — back-compat with Phase-0 components.
        // Map old semantic names → new font stack. Remove after Phase 2.
        'display-lg-mobile': ['"Playfair Display"', 'Georgia', 'serif'],
        'headline-md':       ['"Playfair Display"', 'Georgia', 'serif'],
        'headline-sm':       ['"Playfair Display"', 'Georgia', 'serif'],
        'accent-italic':     ['"Playfair Display"', 'Georgia', 'serif'],
        'body-lg':           ['Inter', 'system-ui', 'sans-serif'],
        'body-md':           ['Inter', 'system-ui', 'sans-serif'],
        'label-md':          ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display scale (Playfair)
        'display-2xl': ['3.5rem',  { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-xl':  ['3rem',    { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '700' }],
        'display-lg':  ['2.5rem',  { lineHeight: '1.15', letterSpacing: '-0.02em',  fontWeight: '700' }],
        'display-md':  ['2rem',    { lineHeight: '1.2',  letterSpacing: '-0.015em', fontWeight: '600' }],
        'display-sm':  ['1.5rem',  { lineHeight: '1.3',  fontWeight: '600' }],

        // Body scale (Inter)
        'body-lg':  ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md':  ['1rem',     { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm':  ['0.875rem', { lineHeight: '1.55', fontWeight: '400' }],
        'body-xs':  ['0.75rem',  { lineHeight: '1.5',  fontWeight: '400' }],

        // Eyebrow / label (Inter, uppercase tracking)
        'eyebrow':  ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.12em', fontWeight: '600' }],
        'label-md': ['0.875rem',{ lineHeight: '1.2', letterSpacing: '0.04em', fontWeight: '600' }],
        'label-sm': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.04em', fontWeight: '600' }],

        // Price / numeric (JetBrains Mono, tabular)
        'price-lg': ['1.5rem',   { lineHeight: '1.2', fontWeight: '600' }],
        'price-md': ['1.125rem', { lineHeight: '1.2', fontWeight: '600' }],
        'price-sm': ['0.875rem', { lineHeight: '1.2', fontWeight: '500' }],

        // Legacy size aliases — back-compat with Phase-0 components.
        // Old semantic names → modern scale equivalents.
        'display-lg-mobile': ['2rem',    { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md':       ['2rem',    { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm':       ['1.5rem',  { lineHeight: '1.4', fontWeight: '600' }],
        'accent-italic':     ['1.25rem', { lineHeight: '1.5', fontWeight: '400' }],
      },

      // ──────────────────────────────────────────────────────────────────
      // 3. SPACING (semantic + extended scale)
      // ──────────────────────────────────────────────────────────────────
      spacing: {
        // Semantic layout
        'container-max': '1200px',
        'margin-mobile': '20px',
        'margin-desktop':'64px',
        'gutter':        '24px',
        'section-y':     '96px',  // vertical rhythm between page sections
        'section-y-sm':  '64px',

        // Extended stops
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
      },

      // ──────────────────────────────────────────────────────────────────
      // 4. RADIUS — single system, used consistently per taste-skill §4.4
      // ──────────────────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '6px',
        sm:      '4px',
        md:      '8px',
        lg:      '12px',
        xl:      '16px',
        '2xl':   '20px',
        '3xl':   '24px',
        '4xl':   '32px',
        full:    '9999px',
      },

      // ──────────────────────────────────────────────────────────────────
      // 5. SHADOWS — quiet, premium, single light direction
      // ──────────────────────────────────────────────────────────────────
      boxShadow: {
        'xs':       '0 1px 2px 0 rgb(42 26 46 / 0.04)',
        'sm':       '0 1px 3px 0 rgb(42 26 46 / 0.06), 0 1px 2px -1px rgb(42 26 46 / 0.04)',
        'md':       '0 4px 12px -2px rgb(42 26 46 / 0.08), 0 2px 4px -1px rgb(42 26 46 / 0.04)',
        'lg':       '0 8px 24px -4px rgb(42 26 46 / 0.1), 0 4px 8px -2px rgb(42 26 46 / 0.05)',
        'xl':       '0 16px 40px -8px rgb(42 26 46 / 0.12), 0 6px 16px -4px rgb(42 26 46 / 0.06)',
        'card':     '0 1px 3px 0 rgb(42 26 46 / 0.05), 0 1px 2px -1px rgb(42 26 46 / 0.03)',
        'card-hover': '0 8px 24px -6px rgb(42 26 46 / 0.1), 0 2px 6px -2px rgb(42 26 46 / 0.04)',
        'primary':  '0 8px 24px -6px rgb(177 14 107 / 0.35), 0 2px 8px -2px rgb(177 14 107 / 0.2)',
        'primary-hover': '0 12px 32px -8px rgb(177 14 107 / 0.42), 0 4px 12px -4px rgb(177 14 107 / 0.25)',
        'focus':    '0 0 0 3px rgb(177 14 107 / 0.18)',
        'inset':    'inset 0 1px 2px 0 rgb(42 26 46 / 0.05)',
      },

      // ──────────────────────────────────────────────────────────────────
      // 6. ANIMATIONS — motivated only (per taste-skill §14 motion check)
      // ──────────────────────────────────────────────────────────────────
      animation: {
        'fade-in':        'fadeIn 0.5s ease-out forwards',
        'fade-in-up':     'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in-down':   'fadeInDown 0.5s ease-out forwards',
        'scale-in':       'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-up':    'slideInUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer':        'shimmer 1.8s infinite linear',
        'ping-soft':      'pingSoft 1.6s cubic-bezier(0.4,0,0.2,1) infinite',
        'spin':           'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp:    { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInDown:  { '0%': { opacity: '0', transform: 'translateY(-12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:     { '0%': { opacity: '0', transform: 'scale(0.97)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideInRight:{ '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideInUp:   { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pingSoft:    { '75%, 100%': { transform: 'scale(1.6)', opacity: '0' } },
        spin:        { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
      },

      // ──────────────────────────────────────────────────────────────────
      // 7. TRANSITIONS
      // ──────────────────────────────────────────────────────────────────
      transitionTimingFunction: {
        'spring':    'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth':    'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
      },

      // ──────────────────────────────────────────────────────────────────
      // 8. LETTER SPACING
      // ──────────────────────────────────────────────────────────────────
      letterSpacing: {
        'eyebrow': '0.12em',
        'widest2': '0.2em',
        'widest3': '0.3em',
      },

      // ──────────────────────────────────────────────────────────────────
      // 9. BACKGROUND IMAGES (clean, single-purpose)
      // ──────────────────────────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.6) 50%, transparent 100%)',
        'skeleton': 'linear-gradient(90deg, rgb(42 26 46 / 0.04) 0%, rgb(42 26 46 / 0.08) 50%, rgb(42 26 46 / 0.04) 100%)',
      },

      // ──────────────────────────────────────────────────────────────────
      // 10. MAX WIDTH (single container)
      // ──────────────────────────────────────────────────────────────────
      maxWidth: {
        'container': '1200px',
        'content':   '768px',
        'wide':      '1440px',
      },
    },
  },
  plugins: [],
}
