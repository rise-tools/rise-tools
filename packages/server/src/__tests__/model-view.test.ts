import { describe, expect, test, vi } from 'vitest'

import { query } from '../model-query'
import { state } from '../model-state'
import { view } from '../model-view'
import { createWaitableMock } from './test-utils'

describe('view models', () => {
  test('basic view get/set', async () => {
    const [a, setA] = state(2)
    const [b] = state(3)
    const mult = view((get) => {
      const _a = get(a)
      const _b = get(b)
      if (!_a || !_b) return 0
      return _a * _b
    })
    expect(mult.get()).toBe(6)
    setA(3)
    expect(await mult.load()).toBe(9)
  })
  test('view is cached according to deps', async () => {
    const [a, setA] = state(2)
    const [b] = state(3)
    const mockA = {
      ...a,
      get: vi.fn().mockImplementation(() => a.get()),
    }
    const viewLoad = vi.fn().mockImplementation((get) => {
      const _a = get(mockA)
      const _b = get(b)
      if (!_a || !_b) return 0
      return _a * _b
    })
    const mult = view(viewLoad)
    expect(mult.get()).toBe(6)
    expect(viewLoad).toBeCalledTimes(1)
    expect(mockA.get).toBeCalledTimes(1)
    mult.get()
    expect(viewLoad).toBeCalledTimes(1)
    expect(mockA.get).toBeCalledTimes(1)
    setA(3)
    expect(await mult.load()).toBe(9)
  })
  test('basic view subscribe', async () => {
    const [a, setA] = state(2)
    const [b] = state(3)
    const mult = view((get) => {
      const _a = get(a)
      const _b = get(b)
      if (!_a || !_b) return 0
      return _a * _b
    })
    const handler = vi.fn()
    mult.subscribe(handler)
    setA(3)
    expect(await mult.load()).toBe(9)
  })
  test('view updates when deps change', async () => {
    const [a, setA] = state(2)
    const [b] = state(3)
    const mult = view((get) => {
      const _a = get(a)
      const _b = get(b)
      if (!_a || !_b) return 0
      return _a * _b
    })
    const [handler, waitToHaveBeenCalled] = createWaitableMock()
    const firstCall = waitToHaveBeenCalled(1)
    mult.subscribe(handler)
    await firstCall
    setA(3)
    await waitToHaveBeenCalled(2)
    expect(mult.get()).toBe(9)
  })
  test('view updates only once when two deps change', async () => {
    const [a, setA] = state(2)
    const [b, setB] = state(3)
    const mult = view((get) => {
      const _a = get(a)
      const _b = get(b)
      if (!_a || !_b) return 0
      return _a * _b
    })
    const [handler, waitToHaveBeenCalled] = createWaitableMock()
    const firstCall = waitToHaveBeenCalled(1)
    mult.subscribe(handler)
    await firstCall
    setA(3)
    setB(4)
    await waitToHaveBeenCalled(2)
    expect(mult.get()).toBe(12)
    expect(handler).toBeCalledTimes(2)
  })
  test('view loads dependency query', async () => {
    let currentQueryValue = 0
    const loader = vi.fn(() => Promise.resolve(currentQueryValue))
    const aQuery = query(loader)
    const aDoubled = view((get) => {
      const a = get(aQuery)
      if (a === undefined) return undefined
      return a * 2
    })
    expect(loader).toHaveBeenCalledTimes(0)
    expect(aDoubled.get()).toBe(undefined)
    expect(await aDoubled.load()).toBe(0)
    expect(loader).toHaveBeenCalledTimes(1)
    currentQueryValue = 1
    aQuery.invalidate()
    expect(aDoubled.get()).toBe(0)
    expect(await aDoubled.load()).toBe(2)
    expect(loader).toHaveBeenCalledTimes(2)
  })
  // todo: make sure view loads dependency query properly during subscription
})
