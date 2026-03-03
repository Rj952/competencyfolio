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
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
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
        'glow': '0 0 0 1px rgba(245,158,11,0.08)',
      },
    },
  },
  plugins: [],
};
