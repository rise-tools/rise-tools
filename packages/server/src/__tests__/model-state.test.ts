import { describe, expect, test, vi } from 'vitest'

import { state } from '../model-state'

describe('model-state', () => {
  test('get and set', () => {
    const [s, setS] = state(0)
    expect(s.get()).toBe(0)
    setS(1)
    expect(s.get()).toBe(1)
  })
  test('mutation setter', () => {
    const [s, setS] = state(0)
    expect(s.get()).toBe(0)
    setS((s) => s + 1)
    expect(s.get()).toBe(1)
  })
  test('mutation setter with no update', () => {
    const handler = vi.fn()
    const [s, setS] = state(0)
    const release = s.subscribe(handler)
    expect(handler).toBeCalledTimes(1)
    expect(handler).toHaveBeenLastCalledWith(0)
    expect(s.get()).toBe(0)
    setS((s) => s)
    expect(handler).toBeCalledTimes(1)
    setS((s) => s + 1)
    expect(handler).toBeCalledTimes(2)
    expect(handler).toHaveBeenLastCalledWith(1)
    release()
    setS((s) => s + 1)
    expect(s.get()).toBe(2)
    // this is the main thing we are checking in this test:
    expect(handler).toBeCalledTimes(2)
    // if the mutation setter is returns the input value, the subscriber should not be called
    expect(handler).toHaveBeenLastCalledWith(1)
  })
  test('subscribe', () => {
    const handler = vi.fn()
    const [s, setS] = state(0)
    const release = s.subscribe(handler)
    expect(handler).toBeCalledTimes(1)
    expect(handler).toBeCalledWith(0)
    setS(1)
    expect(handler).toBeCalledTimes(2)
    expect(handler).toHaveBeenLastCalledWith(1)
    release()
    setS(2)
    expect(handler).toBeCalledTimes(2)
  })
})
