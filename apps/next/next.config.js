const { withTamagui } = require('@tamagui/next-plugin')

const tamagui = withTamagui({
  config: './tamagui.config.ts',
  components: ['tamagui'],
  outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
})

const config = tamagui({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
})

module.exports = config
