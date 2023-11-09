/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    maxWidth: {
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%'
    },
    screens: {
      'sm': {'max': '639px'},

      'md': {'max': '767px'},

      'lg': {'max': '1023px'},

      'xl': {'max': '1279px'}
    },
    fontFamily: {
      'sans': ['Ubuntu', 'Sans-serif']
    },
    extend: {
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      },
      colors: {
        'darkest-blue': '#141b2d',
        'standout-blue': '#1f2a40'
      },
      minWidth: {
        '300': '20rem'
      },
    },
  },
  plugins: [require("daisyui")],

}
