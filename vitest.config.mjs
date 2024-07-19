import path from 'node:path'

import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineProject } from 'vitest/config'

export default defineProject({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, 'vitest/setup.js')],
    server: {
      deps: {
        inline: ['@rise-tools/cli'],
      },
    },
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
