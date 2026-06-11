/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--tw-primary-50) / <alpha-value>)',
          100: 'rgb(var(--tw-primary-100) / <alpha-value>)',
          200: 'rgb(var(--tw-primary-200) / <alpha-value>)',
          300: 'rgb(var(--tw-primary-300) / <alpha-value>)',
          400: 'rgb(var(--tw-primary-400) / <alpha-value>)',
          500: 'rgb(var(--tw-primary-500) / <alpha-value>)',
          600: 'rgb(var(--tw-primary-600) / <alpha-value>)',
          700: 'rgb(var(--tw-primary-700) / <alpha-value>)',
          800: 'rgb(var(--tw-primary-800) / <alpha-value>)',
          900: 'rgb(var(--tw-primary-900) / <alpha-value>)',
        },
        block: {
          move: 'rgb(var(--tw-block-move) / <alpha-value>)',
          turn: 'rgb(var(--tw-block-turn) / <alpha-value>)',
          loop: 'rgb(var(--tw-block-loop) / <alpha-value>)',
          condition: 'rgb(var(--tw-block-condition) / <alpha-value>)',
          function: 'rgb(var(--tw-block-function) / <alpha-value>)',
        },
        themed: {
          surface: 'rgb(var(--theme-surface) / <alpha-value>)',
          'surface-alt': 'rgb(var(--theme-surface-alt) / <alpha-value>)',
          'surface-hover': 'rgb(var(--theme-surface-hover) / <alpha-value>)',
          'surface-tertiary': 'rgb(var(--theme-surface-tertiary) / <alpha-value>)',
          text: 'rgb(var(--theme-text) / <alpha-value>)',
          'text-secondary': 'rgb(var(--theme-text-secondary) / <alpha-value>)',
          'text-muted': 'rgb(var(--theme-text-muted) / <alpha-value>)',
          'text-inverse': 'rgb(var(--theme-text-inverse) / <alpha-value>)',
          border: 'rgb(var(--theme-border) / <alpha-value>)',
          'border-strong': 'rgb(var(--theme-border-strong) / <alpha-value>)',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 0.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
