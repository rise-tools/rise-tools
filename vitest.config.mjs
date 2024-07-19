import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineProject } from 'vitest/config'

import tsConfig from './tsconfig.json'

const alias = Object.fromEntries(
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
    server: {
      deps: {
        // https://github.com/vitest-dev/vitest/issues/1387
        // https://github.com/evanw/esbuild/issues/1719#issuecomment-953470495
        // https://github.com/evanw/esbuild/issues/532
        inline: ['tamagui'],
      },
    },
  },
  esbuild: {
    jsxDev: false,
    jsx: 'transform',
  },
  resolve: {
    alias,
  },
})
