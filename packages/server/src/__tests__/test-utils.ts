export function createWaitableMock<MockInput extends Array<unknown>, MockOutput>(
  fn?: (...args: MockInput) => MockOutput
) {
  let resolve
  let times
  let calledCount = 0
  const mock = jest.fn((...args: MockInput) => {
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
