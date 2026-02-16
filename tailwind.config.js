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
          50:  '#eef4ff',
          100: '#dbe7ff',
          200: '#bfd3ff',
          300: '#93b4ff',
          400: '#5f8cff',
          500: '#3a66f5',
          600: '#2748db',
          700: '#1f38b2',
          800: '#1c318d',
          900: '#1a2c73',
        },
        accent: '#2748db', // norm-600
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
