/* tailwind.config.ts */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EXACT PORT FROM YOUR GLOBAL.CSS VARIABLES
        bg: {
          app: "#09090b",      // --bg-app
          panel: "#121214",    // --bg-panel
          header: "#18181b",   // --bg-panel-header
        },
        neon: {
          cyan: "#22d3ee",     // --neon-cyan-rgb: 34, 211, 238
          teal: "#2dd4bf",     // --neon-teal-rgb: 45, 212, 191
          blue: "#60a5fa",     // --neon-blue-rgb: 96, 165, 250
          purple: "#a78bfa",   // --neon-purple-rgb: 167, 139, 250
          orange: "#fb923c",   // --neon-orange-rgb: 251, 146, 60
          red: "#ef4444",      // --neon-red-rgb: 239, 68, 68
        },
        text: {
          main: "#f4f4f5",     // --text-main
          muted: "#a1a1aa",    // --text-muted
        }
      },
      fontFamily: {
        // We will stick to clean sans for web, mono for data
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        // The Scanline effect adapted for Tailwind
        'scanline': "linear-gradient(to bottom, rgba(34, 211, 238, 0.05) 50%, rgba(0, 0, 0, 0.1) 50%)",
      }
    },
  },
  plugins: [],
};
export default config;