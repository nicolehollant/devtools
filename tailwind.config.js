/** @type {import('tailwindcss').Config} */
const LineClamp = require('@tailwindcss/line-clamp')
const Typography = require('@tailwindcss/typography')
const Forms = require('@tailwindcss/forms')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          mid: '#412D36',
          middark: '#332028',
          faded: '#31282F',
          dark: '#201A1F',
        },
      },
    },
  },
  plugins: [LineClamp, Typography, Forms],
}
