import { mergeConfig } from 'vitest/config'

import { react } from '../../test/config.mjs'

export default mergeConfig(react, {
  test: {
    // Required for `jest-websocket-mock` to work. Adds `expect` to the global namespace,
    // just like Jest
    globals: true,
  },
})
