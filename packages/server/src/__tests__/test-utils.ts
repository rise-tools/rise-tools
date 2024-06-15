export const createWaitableMock = () => {
  let resolve
  let times
  let calledCount = 0
  const mock = jest.fn()
  mock.mockImplementation(() => {
    calledCount += 1
    if (resolve && calledCount >= times) {
      resolve()
    }
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
