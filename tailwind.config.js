/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66aaf9',
          400: '#338ef7',
          500: '#1a73e8',
          600: '#155cba',
          700: '#10458b',
          800: '#0b2e5d',
          900: '#05172e',
        }
      }
    }
  },
  plugins: [],
} 