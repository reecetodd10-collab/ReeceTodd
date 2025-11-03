/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aivra Primary Palette - Charcoal & Grays
        charcoal: {
          DEFAULT: '#0a0a0a',
          light: '#1a1a1a',
        },
        gray: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#a0a0a0',
        },
        // Accent Colors - Three Options (Default: Blue)
        accent: {
          DEFAULT: '#3b82f6', // blue-500 (OPTION A - Default)
          glow: '#60a5fa',    // blue-400
          // Alternative options for preview:
          red: '#ef4444',      // red-500 (OPTION B)
          redGlow: '#f87171',  // red-400
          green: '#10b981',    // emerald-500 (OPTION C)
          greenGlow: '#34d399', // emerald-400
        },
        // Keep for compatibility but will be phased out
        primary: {
          DEFAULT: '#3b82f6', // maps to accent blue
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
