/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pad-default': '#1e293b',
        'pad-hover': '#334155',
        'pad-playing': '#0e7490',
        'surface': '#0f172a',
        'surface-2': '#1e293b',
        'surface-3': '#334155',
        'accent': '#06b6d4',
        'accent-hover': '#0891b2',
      },
      animation: {
        'pad-glow': 'pad-glow 1s ease-in-out infinite',
        'pulse-once': 'pulse 0.3s ease-in-out 1',
      },
      keyframes: {
        'pad-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)' },
          '50%': { boxShadow: '0 0 20px rgba(6, 182, 212, 1), 0 0 40px rgba(6, 182, 212, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
