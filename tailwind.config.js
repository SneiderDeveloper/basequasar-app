/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  prefix: 'tw-',
  content: [],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      blue: colors.blue,
      gray: colors.gray,
      indigo: colors.indigo,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      purple: colors.purple,
      pink: colors.pink,
      blueGray: colors.blueGray,
      orange: colors.orange,
      lime: colors.lime,
      teal: colors.teal,
      cyan: colors.cyan,
    },
  },
  plugins: [],
}
