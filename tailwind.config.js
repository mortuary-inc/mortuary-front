const colorTheme = {
  'primary': '#1C1C1C',
  'secondary': '#FFF7DA',
  'third': '#AD95F0',
  'fourth': '#57FAAC',
  'disabled': '#5e5c54',
  'grayNFT': '#EDE2BC',
  'grayTransparent': '#00000055',
  'grayBurn': '#292929',
  'grayDark': '#222222',
  'graySlot': '#252525',
  'grayInput': '#494949',
  'grayDisabled': '#B4B4B4',
  'grayDuration': '#535353',
  'violetUnderline': '#C5B0FF',
  'backgroundColorPlaceHolder': '#e6e0ca',
  'foregroundColorPlaceHolder': '#f4eed7', 
  'secondary-h': '#EDE2BC',
  'secondary-h2': '#D5CBA9',
  'third-h': '#826AC6',
  'third-a': '#7863B5',
  'fourth-h': '#50DE9A',
  'primary-h': '#292929',
};

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: colorTheme,
      textColor: colorTheme,
      colors: colorTheme,
      borderColor: colorTheme,
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '11/12': '91.666667%'
      },
      maxHeight: {
        '80-screen': '80vh',
        '90-screen': '90vh',
      },
      fontFamily: {
        'sans': ['MaisonNeueMedium', 'Helvetica', 'Arial', 'sans-serif'],
        'sansLight': ['MaisonNeueLight', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['IvarHeadline', 'Helvetica', 'Arial', 'sans-serif'],
      },
      inset: {
        '-3': '-3px',
        '-4': '-4px',
       },
       fontSize: {
        '2xls': '1.4rem',
        'xxs': '.65rem',
      },
      spacing: {
        '100': '26rem',
        '104': '28rem',
        '108': '30rem',
        '112': '32rem',
        '116': '34rem',
        '120': '36rem',
        '124': '38rem',
        '126': '54rem',
        '128': '56rem',
      },
      gridTemplateColumns: {
       '7/3': '70% 30%'
      },
      minHeight: {
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '100': '28rem',
        '104': '32rem',
        '108': '36rem',
        '112': '40rem',
       },
       height: {
        '50-screen': '50vh',
       },
       transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.19, 1, 0.22, 1)',
       },
       transitionDelay: {
        '1500': '1500ms',
        '2000': '2000ms',
       },
       translate: {
        '11/10': '110%',
        '-11/10': '-110%',
       },
       transitionDuration: {
        '1500': '1500ms',
       },
       scale: {
        '25': '0.25',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // ...
  ],
};