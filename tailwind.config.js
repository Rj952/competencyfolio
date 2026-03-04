/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        coral: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        sea: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        stone: {
          925: '#1c1917',
          950: '#0c0a09',
        },
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(28,25,23,0.04)',
        'card-md': '0 4px 16px rgba(28,25,23,0.06)',
        'card-lg': '0 12px 48px rgba(28,25,23,0.08)',
        'card-dark': '0 1px 2px rgba(0,0,0,0.3)',
        'card-md-dark': '0 4px 16px rgba(0,0,0,0.4)',
        'glow': '0 0 0 1px rgba(20,184,166,0.12)',
      },
    },
  },
  plugins: [],
};
