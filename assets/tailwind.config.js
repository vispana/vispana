module.exports = {
  mode: 'jit',
  theme: {
    screens: {
      'sm': {'max': '639px'},

      'md': {'max': '767px'},

      'lg': {'max': '1023px'},

      'xl': {'max': '1279px'},
    },
    fontFamily: {
      'sans': ['Ubuntu', 'Sans-serif']
    },
    extend: {
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      colors: {
        'darkest-blue': '#141b2d',
        'standout-blue': '#1f2a40'
      },
      minWidth: {
        '300': '20rem',
      },
    },
  },
  variants: {},
  plugins: [
    require('tailwindcss-animatecss')({
      settings: {
        animatedSpeed: 1000,
        heartBeatSpeed: 1000,
        hingeSpeed: 2000,
        bounceInSpeed: 750,
        bounceOutSpeed: 750,
        animationDelaySpeed: 1000
      },
      variants: ['responsive'],
    }),
  ],
  purge: [
    "../lib/**/*.eex",
    "../lib/**/*.leex",
    "../lib/**/*_view.ex",
    "../lib/**/views/*.ex"
  ]
}
