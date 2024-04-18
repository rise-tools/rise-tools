module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      // if you want reanimated support
      'react-native-reanimated/plugin',
      // Is this needed?
      // ...(process.env.EAS_BUILD_PLATFORM === 'android'
      //   ? []
      //   : [
      //       [
      //         '@tamagui/babel-plugin',
      //         {
      //           // tbd: make sure we have all packages here
      //           components: [
      //             '@final-ui/tamagui',
      //             '@final-ui/components',
      //             'tamagui',
      //           ],
      //           config: 'tamagui.config.ts',
      //         },
      //       ],
      //     ]),
      'transform-inline-environment-variables',
    ],
  }
}
