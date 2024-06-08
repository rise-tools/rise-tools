import { lookup } from '../model-lookup'
import { state } from '../model-state'
import { findModel } from '../model-utils'

describe('findModel', () => {
  test('root find', () => {
    const [stateModel] = state(0)
    expect(findModel(stateModel, [])).toBe(stateModel)
  })
  test('find in object', () => {
    const [stateModel] = state(0)
    expect(findModel({ foo: stateModel }, ['foo'])).toBe(stateModel)
  })
  test('find fn in object', () => {
    const fnModel = () => 'hello'
    const foundModel = findModel({ fnModel }, ['fnModel'])
    expect(typeof foundModel === 'function' ? foundModel() : null).toBe('hello')
  })
  test('find in nested lookup', () => {
    const [stateModel] = state(0)
    expect(
      findModel(
        lookup((a) => {
          if (a === 'foo')
            return lookup((b) => {
              if (b === 'bar') return stateModel
              return undefined
            })
          return undefined
        }),
        ['foo', 'bar']
      )
    ).toBe(stateModel)
  })
})
