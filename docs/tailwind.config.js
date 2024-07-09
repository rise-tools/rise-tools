/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    darkMode: ['selector', '[data-theme="dark"]'],
    extend: {
      colors: {
        primary: 'var(--ifm-color-primary)',
        secondary: '#fd26b5',
        'primary-dark': 'var(--ifm-color-primary-dark)',
        'primary-darker': 'var(--ifm-color-primary-darker)',
        'primary-darkest': 'var(--ifm-color-primary-darkest)',
        'primary-light': 'var(--ifm-color-primary-light)',
        'primary-lighter': 'var(--ifm-color-primary-lighter)',
        'primary-lightest': 'var(--ifm-color-primary-lightest)',
        'navbar-background': 'var(--ifm-navbar-background-color)',
        background: '#150235',
      },
      backgroundImage: {
        'hero-image': 'url(/img/web-banner.jpg)',
      },
    },
  },
  plugins: [],
}
