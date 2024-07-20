import { describe, expect, test, vi } from 'vitest'

import { query } from '../model-query'
import { createWaitableMock, delay } from './test-utils'

describe('query model', () => {
  test('basic query get + load', async () => {
    const q = query(() => Promise.resolve(1))
    expect(q.get()).toBe(undefined)
    expect(await q.load()).toBe(1)
    expect(q.get()).toBe(1)
  })
  test('double load does not re-fetch source', async () => {
    const queryFn = vi.fn(() => Promise.resolve(1))
    const q = query(queryFn)
    expect(queryFn).toBeCalledTimes(0)
    expect(await q.load()).toBe(1)
    expect(queryFn).toBeCalledTimes(1)
    expect(await q.load()).toBe(1)
    expect(queryFn).toBeCalledTimes(1)
  })
  test('basic query invalidate', async () => {
    let result = 1
    const q = query(() => Promise.resolve(result))
    expect(await q.load()).toBe(1)
    result = 2
    q.invalidate()
    expect(await q.load()).toBe(2)
  })
  test('basic subscribe with resolve', async () => {
    let result = 1
    const q = query(() => Promise.resolve(result))
    const value = await q.load()
    expect(value).toBe(1)
    const handler = vi.fn()
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
  test('basic subscribe (waiting)', async () => {
    let result = 1
    const loader = vi.fn(() => Promise.resolve(result))
    const q = query(loader)
    const value = await q.load()
    expect(value).toBe(1)
    const [subHandle, waitToHaveBeenCalled] = createWaitableMock()
    const release = q.subscribe(subHandle)
    expect(subHandle).toBeCalledTimes(1)
    expect(subHandle).toBeCalledWith(1)
    expect(loader).toBeCalledTimes(1)
    result = 2
    q.invalidate()
    await waitToHaveBeenCalled(2)
    expect(loader).toBeCalledTimes(2)
    expect(subHandle).toBeCalledTimes(2)
    expect(subHandle).toHaveBeenLastCalledWith(2)
    release()
    result = 3
    q.invalidate()
    await delay(100) // just to be sure
    expect(loader).toBeCalledTimes(2)
    expect(subHandle).toBeCalledTimes(2)
  })
})
