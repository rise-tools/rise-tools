import path from 'node:path'

import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, 'vitest/setup.js')],
  },
  esbuild: {
    jsxDev: false,
    jsx: 'transform',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
