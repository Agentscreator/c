import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#2A2A2A", // Updated from #1A1A1A
        foreground: "#FFFFFF", // Ensure white text
        primary: {
          DEFAULT: "#00FF41",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#FF6B35",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#404040", // Updated from #2D2D2D
          foreground: "#FFFFFF", // Ensure white text
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "#404040", // Updated card background
          foreground: "#FFFFFF", // White text on cards
        },
      },
      borderRadius: {
        lg: "1rem", // More rounded
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.15)",
        "glow-green": "0 0 20px rgba(0, 255, 65, 0.3)",
        "glow-orange": "0 0 20px rgba(255, 107, 53, 0.3)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
