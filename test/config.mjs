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
    include: ['**/src/**/*.test.*'],
    typecheck: {
      ignoreSourceErrors: true,
      enabled: true,
    },
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
  },
  esbuild: {
    jsxImportSource: 'react',
  },
})
