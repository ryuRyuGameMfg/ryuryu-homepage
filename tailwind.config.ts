import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Brand Colors
        brand: {
          primary: '#06b6d4',    // cyan-500
          secondary: '#a855f7',  // purple-500
        },
        // Action Colors
        action: {
          DEFAULT: '#2563eb',    // blue-600
          hover: '#1d4ed8',      // blue-700
        },
      },
      // Gradient shortcuts for common patterns
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #22d3ee, #2563eb)',      // cyan-400 to blue-600
        'gradient-cta': 'linear-gradient(to right, #2563eb, #06b6d4)',        // blue-600 to cyan-600
        'gradient-featured': 'linear-gradient(to right, #2563eb, #06b6d4)',   // blue-600 to cyan-600
        'gradient-success': 'linear-gradient(to right, #22c55e, #059669)',    // green-500 to emerald-600
      },
      // Glow effects
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config