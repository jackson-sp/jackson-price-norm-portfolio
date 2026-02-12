/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        norm: {
          50: '#eeeaff',
          100: '#ddd6f9',
          200: '#c6bcf2',
          300: '#9e8ee5',
          400: '#7259e0',
          500: '#2800d7',
          600: '#2300bd',
          700: '#24079f',
          800: '#220c81',
          900: '#1f0f67',
          950: '#160c40',
        },
        accent: '#2800d7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
