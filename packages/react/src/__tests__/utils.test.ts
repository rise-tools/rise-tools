import { expect, it } from 'vitest'

import { lookupValue } from '../utils'

it('should lookup value', () => {
  expect(lookupValue({ a: { b: { c: 1 } } }, ['a', 'b', 'c'])).toBe(1)
  expect(lookupValue({ a: { b: { c: [1] } } }, ['a', 'b', 'c', 0])).toBe(1)
  expect(lookupValue({ a: true }, [])).toEqual({ a: true })

  expect(lookupValue({ arr: [{ key: 'foo' }, { key: 'bar' }] }, ['arr', 'foo'])).toEqual({
    key: 'foo',
  })
})

it('should throw on non-object', () => {
  expect(() => lookupValue('string', ['path'])).toThrow()
})
