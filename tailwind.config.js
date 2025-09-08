/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Baloo Bhai 2', 'cursive'],
      },
      colors: {
        saffron: '#FF9933',
        maroon: '#800020',
        ivory: '#FFFFF0',
        'pastel-orange': '#FFB347',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};