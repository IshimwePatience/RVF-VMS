/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#12aeec',
          dark: '#0f96cc'
        },
        blue: {
          50: '#eef9fd',
          100: '#d7f0fa',
          200: '#b6e4f6',
          300: '#86d1f0',
          400: '#52bce8',
          500: '#2da3d7',
          600: '#12aeec',
          700: '#0f96cc',
          800: '#11769d',
          900: '#136181',
          950: '#0e3e56',
        },
        background: '#f8fafc',
        surface: '#ffffff'
      }
    },
  },
  plugins: [],
}
