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
})
