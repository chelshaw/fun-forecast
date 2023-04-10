const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.hbs', './app/components/*.js'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: {
        lightest: '#E8F9FF',
        lighter: '#C1F0FF',
        light: '#87E2FF',
        bright: '#2ECDFF',
        dark: '#00A1E0',
        darker: '#00699E',
        darkest: '#004368',
      },
      green: {
        lightest: '#E2FCEB',
        lighter: '#B0F7C7',
        light: '#66DE8E',
        bright: '#2CCD62',
        dark: '#0AAD40',
        darker: '#1C863F',
        darkest: '#16542B',
      },
      red: {
        lightest: '#FFECEC',
        lighter: '#FFBBBD',
        light: '#FF9295',
        bright: '#F14B50',
        dark: '#D12025',
        darker: '#A50E13',
        darkest: '#6B1215',
      },
      yellow: {
        lightest: '#FFF4DD',
        lighter: '#FFE6B0',
        light: '#FDD173',
        bright: '#FEBB2D',
        dark: '#DE9E15',
        darker: '#BD8203',
        darkest: '#865B00',
      },
      magenta: {
        lightest: '#FCE8FC',
        lighter: '#F5B5F6',
        light: '#F48DF6',
        bright: '#F652F9',
        dark: '#DE25E2',
        darker: '#A52EA7',
        darkest: '#712572',
      },
    },
    extend: {
      dropShadow: {
        glow: '0 35px 35px rgba(255, 255, 255, 0.55)',
      },
      keyframes: {
        bigSmall: {
          '0%, 100%': { transform: 'scale(100%)' },
          '50%': { transform: 'scale(350%)' },
        },
        step: {
          '0%, 100%': { transform: 'rotate(-20deg)' },
          '50%': { transform: 'rotate(40deg)' },
        },
        bicycle: {
          '0%': { left: '100%', transform: 'rotate(40deg)' },
          '25%': { left: '65%', transform: 'rotate(35deg)' },
          '35%': { left: '55%', transform: 'rotate(0deg)' },
          '70%': { left: '0' },
          '100%': { left: '-20%' },
        },
        bicycleSmall: {
          '0%': { left: '100%', transform: 'rotate(40deg)' },
          '25%': { left: '65%', transform: 'rotate(35deg)' },
          '35%': { left: '55%', transform: 'rotate(0deg)' },
          '80%': { left: '-50%' },
          '100%': { left: '-100%' },
        },
        'skate-x': {
          from: {
            left: '-10%',
            transform: 'rotate(30deg)',
          },
          to: {
            left: '110%',
            transform: 'rotate(0deg)',
          },
        },
        'skate-y': {
          from: {
            top: '30%',
          },
          to: {
            top: '35%',
          },
        },
      },
      animation: {
        'big-small': 'bigSmall 6s ease-in-out infinite',
        step: 'step 4s ease infinite',
        bicycle: 'bicycle 8s linear 1s infinite',
        'bicycle-small': 'bicycleSmall 8s linear 1s infinite',
        kayak: 'spin 5s ease infinite',
        skateboard:
          'skate-x 5s linear 6s, skate-y 5s cubic-bezier(0.5,5,0.5,-10) 6s',
        'spin-slow': 'spin 3s linear infinite;',
      },
    },
  },
  plugins: [],
};
