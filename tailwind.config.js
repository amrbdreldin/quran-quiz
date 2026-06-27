/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable class-based dark mode
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Islamic-themed brand palette — mapped from CSS variables for runtime theming
        primary: {
          DEFAULT: '#004243',
          light: '#005F61',
          dark: '#002C2D',
        },
        accent: {
          DEFAULT: '#FAC46C',
          light: '#FDD89A',
          dark: '#E8A83E',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0F1923',
        },
        'surface-card': {
          DEFAULT: '#F8F9FA',
          dark: '#1A2740',
        },
        success: {
          DEFAULT: '#10B981',
          dark: '#34D399',
        },
        error: {
          DEFAULT: '#EF4444',
          dark: '#F87171',
        },
      },
      fontFamily: {
        arabic: ['var(--font-arabic)', 'Amiri', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'progress': 'progress 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(0, 66, 67, 0.12)',
        'card-dark': '0 4px 24px -4px rgba(0, 0, 0, 0.4)',
        'glow-primary': '0 0 20px rgba(0, 66, 67, 0.3)',
        'glow-accent': '0 0 20px rgba(250, 196, 108, 0.3)',
      },
    },
  },
  plugins: [],
};
