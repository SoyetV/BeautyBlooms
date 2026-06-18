/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'scale-in': 'scaleIn 1.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      colors: {
        bloom: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777', // luxury pink
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        petal: {
          50:  '#fdfbf7', // soft ivory
          100: '#f9f6f0',
          200: '#f2eae1',
          300: '#e6d5c3',
          400: '#d5bba1',
          500: '#c29d7a',
          600: '#a87f5b',
          700: '#8c6446',
          800: '#73523b',
          900: '#5e4432',
        },
        gold: {
          50:  '#fbf9f1',
          100: '#f4f0df',
          200: '#e9e1c1',
          300: '#dacc9a',
          400: '#cca96e',
          500: '#c08d4b', // muted gold
          600: '#a66c3c',
          700: '#854e33',
          800: '#6f4231',
          900: '#5b372a',
        },
        charcoal: {
          50:  '#f6f5f6',
          100: '#e8e6e8',
          200: '#d1cdd1',
          300: '#b1aab2',
          400: '#8c838e',
          500: '#6b616e',
          600: '#534a56',
          700: '#443b46',
          800: '#39333b',
          900: '#2d1b2e', // deep plum / charcoal
          950: '#1f1a1d',
        },
        leaf: {
          500: '#4a7c59',  // supporting green
          600: '#3a6347',
          700: '#2d4f38',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
