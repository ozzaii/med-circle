/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-dark': '#0a0e27',
        'medical-darker': '#050816',
        'medical-blue': '#2563eb',
        'medical-cyan': '#06b6d4',
        'medical-purple': '#7c3aed',
        'medical-pink': '#ec4899',
        'medical-green': '#10b981',
        'accent-glow': '#60a5fa',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-medical': 'linear-gradient(135deg, #0a0e27 0%, #050816 100%)',
        'gradient-holographic': 'linear-gradient(45deg, #2563eb, #7c3aed, #ec4899, #06b6d4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      fontFamily: {
        'display': ['Inter var', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(96, 165, 250, 0.5)',
        'glow-md': '0 0 30px rgba(96, 165, 250, 0.6)',
        'glow-lg': '0 0 40px rgba(96, 165, 250, 0.7)',
        'inner-glow': 'inset 0 0 20px rgba(96, 165, 250, 0.2)',
      },
    },
  },
  plugins: [],
}