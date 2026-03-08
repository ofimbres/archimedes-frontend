/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', 'system-ui', 'sans-serif'],
        body: ['"Fredoka"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Water / buoyancy palette
        water: {
          deep: '#0e4c6d',
          mid: '#1a7fb8',
          light: '#5eb3d6',
          foam: '#a8d8ea',
          surface: '#e8f4f8',
        },
        sand: {
          dark: '#c4a35a',
          DEFAULT: '#e8d5a3',
          light: '#f5e6c8',
        },
        teal: {
          deep: '#0d5c5c',
          mid: '#1a9b9b',
          light: '#4dd4d4',
        },
      },
      borderRadius: {
        bubble: '2rem',
        blob: '2.5rem',
      },
      animation: {
        'bounce-soft': 'bounce-soft 0.6s ease-in-out',
        float: 'float 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.03) translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        bubble: '0 8px 24px -4px rgba(26, 127, 184, 0.2), 0 4px 8px -2px rgba(14, 76, 109, 0.1)',
        'bubble-hover': '0 12px 32px -4px rgba(26, 127, 184, 0.3), 0 6px 12px -2px rgba(14, 76, 109, 0.15)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        archimedes: {
          primary: '#1a7fb8',
          'primary-content': '#ffffff',
          secondary: '#0d5c5c',
          'secondary-content': '#ffffff',
          accent: '#e8d5a3',
          'accent-content': '#0e4c6d',
          neutral: '#0e4c6d',
          'base-100': '#e8f4f8',
          'base-200': '#a8d8ea',
          'base-300': '#5eb3d6',
          'base-content': '#0e4c6d',
          info: '#1a7fb8',
          success: '#1a9b9b',
          warning: '#c4a35a',
          error: '#c45c4a',
        },
      },
    ],
    darkTheme: false,
    base: true,
    styled: true,
    utils: true,
  },
};
