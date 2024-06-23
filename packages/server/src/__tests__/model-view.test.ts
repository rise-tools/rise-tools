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
      get: jest.fn().mockImplementation(() => a.get()),
    }
    const viewLoad = jest.fn().mockImplementation((get) => {
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
    const handler = jest.fn()
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
})
