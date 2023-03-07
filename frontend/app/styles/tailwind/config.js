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
        dark: '#00A1E0',
        darker: '#0070A8',
        darkest: '#004368',
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
    extend: {
      dropShadow: {
        glow: '0 35px 35px rgba(255, 255, 255, 0.55)'
      },
      keyframes: {
        leftToRight: {
          '0%': { left: '-50%' },
          '100%': { left: '150%' },
        },
        rightToLeft: {
          '0%': { left: '150%' },
          '100%': { left: '-50%' },
        },
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
          '35%': { left: '65%', transform: 'rotate(35deg)' },
          '45%': { left: '55%', transform: 'rotate(0deg)' },
          '100%': { left: '-20%' },
        }
      },
      animation: {
        'l-r': 'leftToRight 10s ease-in infinite',
        'r-l': 'rightToLeft 8s ease-in-out infinite',
        'big-small': 'bigSmall 6s ease-in-out infinite',
        'step': 'step 4s ease infinite',
        'bicycle': 'bicycle 8s linear infinite',
        'kayak': 'spin 5s ease infinite'
      }
    }
  },
  plugins: [],
};
