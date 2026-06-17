/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bloom: {
          50:  '#fff1f4',
          100: '#ffe0e7',
          200: '#ffc7d4',
          300: '#ff9db5',
          400: '#ff6490',
          500: '#ff2d6f',  // primary — deep rose
          600: '#ed1257',
          700: '#c80847',
          800: '#a70a3e',
          900: '#8d0d3a',
          950: '#4f0019',
        },
        petal: {
          50:  '#fdf9f0',
          100: '#faf0d9',
          200: '#f4ddb0',  // warm cream accent
          300: '#ecc577',
          400: '#e4a93e',
          500: '#d98f22',
          600: '#be7119',
          700: '#9d5417',
          800: '#804219',
          900: '#6a3718',
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
