import { mergeConfig } from 'vitest/config'

import { react } from '../../test/config.mjs'

export default mergeConfig(react, {
  test: {
    // Required for `jest-websocket-mock` to work
    globals: true,
  },
})
