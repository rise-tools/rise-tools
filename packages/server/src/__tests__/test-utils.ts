import { vi } from 'vitest'

export function createWaitableMock<MockInput extends Array<unknown>, MockOutput>(
  fn?: (...args: MockInput) => MockOutput
) {
  let resolve: () => void
  let times: number
  let calledCount = 0
  const mock = vi.fn((...args: MockInput) => {
    calledCount += 1
    const result = fn ? fn(...args) : undefined
    if (resolve && calledCount >= times) {
      resolve()
    }
    return result
  })
  const waitToHaveBeenCalled = (t: number): Promise<void> => {
    times = t
    if (calledCount >= times) {
      return Promise.resolve()
    }
    return new Promise((r) => {
      resolve = r
    })
  }
  return [mock, waitToHaveBeenCalled] as const
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
