import daisyui from 'daisyui';
import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['IBM Plex Sans Thai', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        top: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      backgroundSize: {
        '400%': '400%',
      },
    },
  },
  plugins: [daisyui, lineClamp],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#8C6239',
        },
      },
    ],
  },
};