import { query } from '../model-query'

describe('query model', () => {
  test('basic query get + load', async () => {
    const q = query(() => Promise.resolve(1))
    expect(q.get()).toBe(undefined)
    expect(await q.load()).toBe(1)
    expect(q.get()).toBe(1)
  })
  test('basic query invalidate', async () => {
    let result = 1
    const q = query(() => Promise.resolve(result))
    expect(await q.load()).toBe(1)
    result = 2
    q.invalidate()
    expect(await q.load()).toBe(2)
  })
  test('basic query subscribe', async () => {
    let result = 1
    const q = query(() => Promise.resolve(result))
    const value = await q.load()
    expect(value).toBe(1)
    const handler = jest.fn()
    const release = q.subscribe(handler)
    expect(handler).toBeCalledTimes(1)
    expect(handler).toBeCalledWith(1)
    result = 2
    q.invalidate()
    await q.resolve()
    expect(handler).toHaveBeenLastCalledWith(2)
    release()
    q.invalidate()
    await q.resolve()
    expect(handler).toBeCalledTimes(2)
  })
})
