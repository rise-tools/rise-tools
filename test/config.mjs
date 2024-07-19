import path from 'node:path'

import reactPlugin from '@vitejs/plugin-react'
import { defineProject, mergeConfig } from 'vitest/config'

import tsConfig from '../tsconfig.json'

const alias = Object.fromEntries(
  Object.entries(tsConfig.compilerOptions.paths).map(([moduleName, [modulePath]]) => [
    moduleName,
    path.resolve(__dirname, '..', modulePath),
  ])
)

export const node = defineProject({
  test: {
    environment: 'node',
  },
  esbuild: {
    jsxDev: false,
    jsx: 'transform',
    jsxImportSource: '@rise-tools/react',
  },
  resolve: {
    alias,
  },
})

export const react = mergeConfig(node, {
  plugins: [reactPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, 'setup.mjs')],
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
    jsxImportSource: 'react',
  },
})
