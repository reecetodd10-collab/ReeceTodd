/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600 - electric blue
          dark: '#1e40af',    // blue-700
          light: '#3b82f6',   // blue-500
        },
        accent: {
          DEFAULT: '#06b6d4', // cyan-500
          dark: '#0891b2',    // cyan-600
          light: '#22d3ee',   // cyan-400
        },
        violet: {
          DEFAULT: '#7c3aed', // purple-600 - soft violet
          dark: '#6d28d9',    // purple-700
          light: '#8b5cf6',   // purple-500
        },
        slate: {
          900: '#0F172A',     // dark background
          200: '#E2E8F0',     // text on dark
        },
      },
      fontFamily: {
        sans: ['Sora', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
