/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ========================================
        // AVIERA UNIFIED COLOR SYSTEM
        // All colors reference CSS variables from globals.css
        // ========================================

        // Background colors - dark canvas system
        bg: {
          DEFAULT: 'var(--bg)',           // #0a0a0a - main background
          elevated: 'var(--bg-elev-1)',   // #1a1a1a - cards, elevated surfaces
          elevated2: 'var(--bg-elev-2)',  // #242424 - higher elevation
        },

        // Text colors - white-based hierarchy
        txt: {
          DEFAULT: 'var(--txt)',          // #ffffff - primary text
          secondary: 'var(--txt-secondary)', // #e5e5e5 - secondary text
          muted: 'var(--txt-muted)',      // #a0a0a0 - muted/disabled text
        },

        // Accent colors - vibrant cyan
        accent: {
          DEFAULT: 'var(--acc)',          // #00d9ff - primary cyan
          hover: 'var(--acc-hover)',      // #00b8d4 - hover state
          light: 'var(--acc-light)',      // rgba(0, 217, 255, 0.1) - subtle bg
          secondary: 'var(--acc-2)',      // #0ea5e9 - sky blue variant
        },

        // Status colors - semantic feedback
        success: 'var(--success)',        // #10b981 - green
        warning: 'var(--warning)',        // #f59e0b - orange
        error: 'var(--error)',            // #ef4444 - red
        info: 'var(--info)',              // #00d9ff - cyan (same as accent)

        // Glass/Border system
        glass: {
          bg: 'var(--glass-bg)',          // rgba(255, 255, 255, 0.05)
          border: 'var(--glass-border)',  // rgba(255, 255, 255, 0.1)
        },

        // Ring/Focus colors
        ring: 'var(--ring)',              // rgba(0, 217, 255, 0.35)

        // Legacy support (deprecated - use new tokens)
        charcoal: {
          DEFAULT: 'var(--bg)',
          light: 'var(--bg-elev-1)',
        },
        gray: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: 'var(--txt-muted)',
        },
        primary: {
          DEFAULT: 'var(--acc)',
        },
      },

      // Border radius using CSS variables
      borderRadius: {
        sm: 'var(--radius-sm)',           // 8px
        md: 'var(--radius-md)',           // 12px
        lg: 'var(--radius-lg)',           // 16px
        xl: 'var(--radius-xl)',           // 20px
        full: 'var(--radius-full)',       // 9999px
      },

      // Spacing using CSS variables
      spacing: {
        'space-1': 'var(--space-1)',      // 8px
        'space-2': 'var(--space-2)',      // 16px
        'space-3': 'var(--space-3)',      // 24px
        'space-4': 'var(--space-4)',      // 32px
        'space-5': 'var(--space-5)',      // 40px
        'space-6': 'var(--space-6)',      // 48px
      },

      // Box shadows using CSS variables
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'glass': 'var(--glass-shadow)',
        'accent': '0 0 20px rgba(0, 217, 255, 0.3), 0 0 40px rgba(0, 217, 255, 0.1)',
        'accent-lg': '0 0 30px rgba(0, 217, 255, 0.4), 0 0 60px rgba(0, 217, 255, 0.15)',
      },

      // Backdrop blur
      backdropBlur: {
        glass: 'var(--glass-blur)',       // 12px
      },

      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },

      // Animation timing
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
