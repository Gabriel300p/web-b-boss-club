/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // 🎨 Expanded Design System Colors
      colors: {
        // Base system colors (CSS custom properties)
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },

        // 🎯 Brand Colors (Enhanced palette)
        brand: {
          50: "oklch(0.971 0.013 264.695)",
          100: "oklch(0.929 0.027 264.695)",
          200: "oklch(0.871 0.054 264.695)",
          300: "oklch(0.792 0.081 264.695)",
          400: "oklch(0.694 0.108 264.695)",
          500: "oklch(0.576 0.135 264.695)", // Primary brand
          600: "oklch(0.458 0.108 264.695)",
          700: "oklch(0.359 0.081 264.695)",
          800: "oklch(0.278 0.054 264.695)",
          900: "oklch(0.216 0.027 264.695)",
          950: "oklch(0.129 0.013 264.695)",
        },

        // 🌈 Semantic Colors (Enhanced)
        success: {
          50: "oklch(0.973 0.044 162.012)",
          100: "oklch(0.937 0.089 162.012)",
          200: "oklch(0.885 0.178 162.012)",
          300: "oklch(0.812 0.267 162.012)",
          400: "oklch(0.720 0.356 162.012)",
          500: "oklch(0.628 0.445 162.012)",
          600: "oklch(0.537 0.356 162.012)",
          700: "oklch(0.445 0.267 162.012)",
          800: "oklch(0.363 0.178 162.012)",
          900: "oklch(0.298 0.089 162.012)",
          950: "oklch(0.171 0.044 162.012)",
        },
        warning: {
          50: "oklch(0.977 0.028 85.875)",
          100: "oklch(0.945 0.056 85.875)",
          200: "oklch(0.890 0.113 85.875)",
          300: "oklch(0.812 0.169 85.875)",
          400: "oklch(0.720 0.225 85.875)",
          500: "oklch(0.628 0.281 85.875)",
          600: "oklch(0.537 0.225 85.875)",
          700: "oklch(0.445 0.169 85.875)",
          800: "oklch(0.363 0.113 85.875)",
          900: "oklch(0.298 0.056 85.875)",
          950: "oklch(0.171 0.028 85.875)",
        },
        error: {
          50: "oklch(0.975 0.028 17.378)",
          100: "oklch(0.943 0.056 17.378)",
          200: "oklch(0.886 0.113 17.378)",
          300: "oklch(0.808 0.169 17.378)",
          400: "oklch(0.714 0.225 17.378)",
          500: "oklch(0.620 0.281 17.378)",
          600: "oklch(0.527 0.225 17.378)",
          700: "oklch(0.435 0.169 17.378)",
          800: "oklch(0.356 0.113 17.378)",
          900: "oklch(0.294 0.056 17.378)",
          950: "oklch(0.169 0.028 17.378)",
        },
        info: {
          50: "oklch(0.975 0.028 248.046)",
          100: "oklch(0.943 0.056 248.046)",
          200: "oklch(0.886 0.113 248.046)",
          300: "oklch(0.808 0.169 248.046)",
          400: "oklch(0.714 0.225 248.046)",
          500: "oklch(0.620 0.281 248.046)",
          600: "oklch(0.527 0.225 248.046)",
          700: "oklch(0.435 0.169 248.046)",
          800: "oklch(0.356 0.113 248.046)",
          900: "oklch(0.294 0.056 248.046)",
          950: "oklch(0.169 0.028 248.046)",
        },
      },
      // 📏 Enhanced Border Radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },

      // 🌫️ Enhanced Shadows
      boxShadow: {
        soft: "0 2px 8px 0 rgb(0 0 0 / 0.08)",
        elegant: "0 4px 16px 0 rgb(0 0 0 / 0.12)",
        floating: "0 8px 32px 0 rgb(0 0 0 / 0.16)",
        glow: "0 0 20px 0 rgb(99 102 241 / 0.2)",
        "glow-success": "0 0 20px 0 rgb(34 197 94 / 0.2)",
        "glow-warning": "0 0 20px 0 rgb(245 158 11 / 0.2)",
        "glow-error": "0 0 20px 0 rgb(239 68 68 / 0.2)",
      },

      // 📱 Enhanced Breakpoints
      screens: {
        xs: "475px",
        "3xl": "1600px",
        "4xl": "1920px",
      },

      // 📏 Enhanced Spacing
      spacing: {
        18: "4.5rem", // 72px
        22: "5.5rem", // 88px
        26: "6.5rem", // 104px
        30: "7.5rem", // 120px
        34: "8.5rem", // 136px
        38: "9.5rem", // 152px
        42: "10.5rem", // 168px
        46: "11.5rem", // 184px
        50: "12.5rem", // 200px
        54: "13.5rem", // 216px
        58: "14.5rem", // 232px
        62: "15.5rem", // 248px
        66: "16.5rem", // 264px
        70: "17.5rem", // 280px
        74: "18.5rem", // 296px
        78: "19.5rem", // 312px
        82: "20.5rem", // 328px
        86: "21.5rem", // 344px
        90: "22.5rem", // 360px
        94: "23.5rem", // 376px
        98: "24.5rem", // 392px
      },

      // 🎯 Z-Index Scale
      zIndex: {
        hide: "-1",
        base: "0",
        docked: "10",
        dropdown: "1000",
        sticky: "1100",
        banner: "1200",
        overlay: "1300",
        modal: "1400",
        popover: "1500",
        skipLink: "1600",
        toast: "1700",
        tooltip: "1800",
      },
      // ⚡ Enhanced Animations & Keyframes
      keyframes: {
        // Original animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "zoom-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "zoom-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },

        // Enhanced animations for micro-interactions
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "bounce-out": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(0.3)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px 0 rgb(99 102 241 / 0.2)" },
          "50%": { boxShadow: "0 0 30px 0 rgb(99 102 241 / 0.4)" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "rotate-in": {
          "0%": { transform: "rotate(-45deg) scale(0)", opacity: "0" },
          "100%": { transform: "rotate(0deg) scale(1)", opacity: "1" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        // Original animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "zoom-in": "zoom-in 0.2s ease-out",
        "zoom-out": "zoom-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.2s ease-out",

        // Enhanced animations
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "bounce-out": "bounce-out 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)",
        shake: "shake 0.6s ease-in-out",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        progress: "progress 1s ease-out",
        "rotate-in": "rotate-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "scale-up": "scale-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "fade-up": "fade-up 0.4s ease-out",
        "fade-down": "fade-down 0.4s ease-out",

        // Duration variants
        "fade-in-fast": "fade-in 0.15s ease-out",
        "fade-in-slow": "fade-in 0.5s ease-out",
        "zoom-in-fast": "zoom-in 0.15s ease-out",
        "zoom-in-slow": "zoom-in 0.5s ease-out",
        "slide-in-fast": "slide-in-from-right 0.15s ease-out",
        "slide-in-slow": "slide-in-from-right 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
