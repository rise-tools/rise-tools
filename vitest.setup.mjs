import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// `matchMedia` is not available in JSDOM, so we need to mock it out
// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// afterEach(() => {
//   cleanup()
// })
