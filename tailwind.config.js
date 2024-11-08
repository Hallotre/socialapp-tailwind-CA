/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{html,js}",
    "./js/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-motion')],
}

