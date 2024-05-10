import { assertEvery } from '../utils'

it('should return true if items are of the same type', () => {
  expect(assertEvery([], (item) => typeof item === 'object')).toBe(true)
  expect(assertEvery([1, 2, 3], (item: number) => typeof item === 'number')).toBe(true)
  expect(assertEvery([{ $: 'event' }, { $: 'event' }], (item) => item.$ === 'event')).toBe(true)
  expect(assertEvery([{ $: 'event' }, { $: 'event' }], (item) => item.$ === 'action')).toBe(true)
})

it('should throw if items are different', () => {
  expect(() =>
    assertEvery([{ $: 'event' }, { $: 'action' }, { $: 'event' }], (item) => item.$ === 'event')
  ).toThrowError()
  expect(() =>
    assertEvery([{ $: 'event' }, { $: 'action' }, { $: 'event' }], (item) => item.$ === 'action')
  ).toThrowError()
})
