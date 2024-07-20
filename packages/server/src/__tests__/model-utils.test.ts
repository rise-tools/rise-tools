import { describe, expect, test } from 'vitest'

import { lookup } from '../model-lookup'
import { state } from '../model-state'
import { findModel, getModelState } from '../model-utils'

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
  test('find fails', () => {
    const [a] = state(0)
    expect(findModel({ a }, ['b'])).toBe(undefined)
    expect(findModel({ a }, ['a', 'b'])).toBe(undefined)
  })
  test('find lookup results in empty string', () => {
    const indexModel = () => ['a']
    const l = lookup((key) => {
      if (key === '') return indexModel
    })
    expect(findModel(l, [])).toBe(indexModel)
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

describe('getModelState', () => {
  test('get state', () => {
    const [stateModel] = state(0)
    expect(getModelState(stateModel)).toBe(0)
  })
  test('get callback model', () => {
    const fnModel = () => 'hello'
    expect(getModelState(fnModel)).toBe('hello')
  })
})
