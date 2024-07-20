import { describe, expect, test } from 'vitest'

import { lookup } from '../model-lookup'
import { state } from '../model-state'

describe('basic lookup behavior', () => {
  test('lookup', () => {
    const l = lookup((key) => {
      return state(key)[0]
    })
    expect(l.get('a')?.get()).toBe('a')
  })
  test('lookup will cache keys', () => {
    const l = lookup((key) => {
      return state(key)[0]
    })
    const a = l.get('a')
    expect(a).toBe(l.get('a'))
  })
})
