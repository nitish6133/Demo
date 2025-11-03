/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#e8dfd0',
          300: '#d9c8ad',
          400: '#c8ad87',
          500: '#b8976a',
          600: '#a17e55',
          700: '#866747',
          800: '#6f553e',
          900: '#5d4735',
        },
        cream: {
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f4efe7',
          300: '#ebe3d5',
          400: '#dfd3bf',
          500: '#d1c0a4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
