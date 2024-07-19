import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineProject } from 'vitest/config'

import tsConfig from './tsconfig.json'

const aliases = Object.fromEntries(
  Object.entries(tsConfig.compilerOptions.paths).map(([moduleName, [modulePath]]) => [
    moduleName,
    path.resolve(__dirname, modulePath),
  ])
)

export default defineProject({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, 'vitest.setup.mjs')],
  },
  esbuild: {
    jsxDev: false,
    jsx: 'transform',
  },
  resolve: {
    alias: {
      ...aliases,
      'react-native': 'react-native-web',
      // https://github.com/evanw/esbuild/issues/1719#issuecomment-953470495
      // https://github.com/evanw/esbuild/issues/532
      tamagui: path.resolve('./node_modules/tamagui/dist/cjs'),
    },
  },
})
