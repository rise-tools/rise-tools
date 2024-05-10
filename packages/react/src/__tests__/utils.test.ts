import { assertAll } from '../utils'

it('should return true if items are of the same type', () => {
  expect(assertAll([], (item) => typeof item === 'object')).toBe(true)
  expect(assertAll([1, 2, 3], (item: number) => typeof item === 'number')).toBe(true)
  expect(assertAll([{ $: 'event' }, { $: 'event' }], (item) => item.$ === 'event')).toBe(true)
  expect(assertAll([{ $: 'event' }, { $: 'event' }], (item) => item.$ === 'action')).toBe(false)
})

it('should throw if items are different', () => {
  expect(() =>
    assertAll([{ $: 'event' }, { $: 'action' }, { $: 'event' }], (item) => item.$ === 'event')
  ).toThrowError()
  expect(() =>
    assertAll([{ $: 'event' }, { $: 'action' }, { $: 'event' }], (item) => item.$ === 'action')
  ).toThrowError()
})
