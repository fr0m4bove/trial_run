// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Crimson Text', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'dark-academia': {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        'parchment': {
          50: '#fefcf0',
          100: '#fef7d7',
          200: '#fdeeb0',
          300: '#fce077',
          400: '#f9cc47',
          500: '#f4b41f',
          600: '#dc9815',
          700: '#b87414',
          800: '#955a18',
          900: '#7a4a18',
        }
      },
      backgroundImage: {
        'dark-academia-gradient': 'linear-gradient(135deg, #43302b 0%, #846358 50%, #977669 100%)',
        'parchment-texture': "url('/themes/dark-academia/textures/parchment.png')",
        'leather-texture': "url('/themes/dark-academia/textures/leather.png')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'book-hover': 'bookHover 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bookHover: {
          '0%': { transform: 'scale(1) rotateY(0deg)' },
          '100%': { transform: 'scale(1.05) rotateY(-5deg)' },
        },
      },
    },
  },
  plugins: [],
}

// ---