const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./app/**/*.hbs', './app/components/*.js'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: {
        lightest: '#C1F0FF',
        lighter: '#87E2FF',
        main: '#2ECDFF',
        dark: '#1DA9D4',
        darker: '#0882A9',
        darkest: '#0F546A',
      },
      green: {
        lightest: '#B0F7C7',
        lighter: '#66DE8E',
        main: '#2CCD62',
        dark: '#0AAD40',
        darker: '#1C863F',
        darkest: '#16542B',
      },
      red: {
        lightest: '#FFBBBD',
        lighter: '#FF9295',
        main: '#F14B50',
        dark: '#D12025',
        darker: '#A50E13',
        darkest: '#6B1215',
      },
      yellow: {
        lightest: '#FFE6B0',
        lighter: '#FDD173',
        main: '#FEBB2D',
        dark: '#DE9E15',
        darker: '#BD8203',
        darkest: '#865B00',
      }
    },
  },
  plugins: [],
};
