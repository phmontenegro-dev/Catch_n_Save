import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        bg: {
          void: 'rgb(var(--bg-void) / <alpha-value>)',
          ink: 'rgb(var(--bg-ink) / <alpha-value>)',
          slate: 'rgb(var(--bg-slate) / <alpha-value>)',
        },
        border: {
          mist: 'rgb(var(--border-mist) / <alpha-value>)',
          glass: 'rgb(var(--border-glass) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          faded: 'rgb(var(--text-faded) / <alpha-value>)',
        },
        gold: {
          100: 'rgb(var(--gold-100) / <alpha-value>)',
          500: 'rgb(var(--gold-500) / <alpha-value>)',
          700: 'rgb(var(--gold-700) / <alpha-value>)',
        },
        signal: {
          up: 'rgb(var(--signal-up) / <alpha-value>)',
          down: 'rgb(var(--signal-down) / <alpha-value>)',
          pokeball: 'rgb(var(--signal-pokeball) / <alpha-value>)',
        },
      },

      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        pixel: ['var(--font-pixel)', 'monospace'],
      },

      fontSize: {
        'display-2xl': [
          'clamp(2.5rem, 7vw, 5.25rem)',
          { lineHeight: '0.95', letterSpacing: '-0.02em' },
        ],
        'display-xl': [
          'clamp(2.25rem, 6vw, 4.25rem)',
          { lineHeight: '1', letterSpacing: '-0.015em' },
        ],
        'display-lg': [
          'clamp(1.875rem, 4vw, 3rem)',
          { lineHeight: '1.05', letterSpacing: '-0.01em' },
        ],
        'display-md': [
          'clamp(1.5rem, 2.5vw, 2rem)',
          { lineHeight: '1.1', letterSpacing: '-0.005em' },
        ],
      },

      spacing: {
        '18': '4.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in': 'slideIn 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'pixel-blink': 'pixelBlink 1.2s steps(2, end) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(2rem)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pixelBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
