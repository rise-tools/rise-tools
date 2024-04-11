/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const { withExpo } = require('@expo/next-adapter')

const plugins = [
  withExpo,
  withTamagui({
    config: 'tamagui.config.ts',
    // tbd: make sure we list all packages
    components: ['tamagui', '@react-native-templates/demo-ui'],
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
  }),
]

let config = {
  transpilePackages: [
    'react-native',
    'expo',
    'expo-modules-core',
    'expo-clipboard',
    'expo-constants',
    'expo-linear-gradient',
    'react-native-qrcode-svg',
  ],
  experimental: {
    scrollRestoration: true,
  },
}

for (const plugin of plugins) {
  config = {
    ...config,
    ...plugin(config),
  }
}

module.exports = config
