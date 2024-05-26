import {
  _debugNextCreatedModelLabel,
  _setDebugNextModelLabel,
  _setEnableDebug,
  createModel,
} from '../models'

describe('basic models', () => {
  test('getter + setter', async () => {
    const model = createModel(() => 'foo' as string)
    expect(await model.get()).toBe('foo')
    await model.set('bar')
    expect(await model.get()).toBe('bar')
  })

  test('invalidate re-calls initializer', async () => {
    const initializer = jest.fn()
    initializer.mockReturnValueOnce('a')
    const model = createModel(initializer)
    expect(await model.get()).toBe('a')
    expect(initializer).toBeCalledTimes(1)
    initializer.mockReturnValueOnce('b')
    model.invalidate()
    expect(await model.get()).toBe('b')
    expect(initializer).toBeCalledTimes(2)
  })
})

describe('derived models', () => {
  test.only('basic dervied value', async () => {
    _setEnableDebug(true)
    _setDebugNextModelLabel('a')
    const a = createModel(2)
    _setDebugNextModelLabel('b')
    const b = createModel(3)
    _setDebugNextModelLabel('mult')
    const mult = createModel(async () => (await a.get()) * (await b.get()))
    expect(await mult.get()).toBe(6)
    await a.set(3)
    expect(await mult.get()).toBe(9)
  })

  test.only('double dervied value', async () => {
    _setEnableDebug(true)
    _setDebugNextModelLabel('a')
    const a = createModel(2)
    _setDebugNextModelLabel('b')
    const b = createModel(3)
    _setDebugNextModelLabel('mult')
    const mult = createModel(async () => (await a.get()) * (await b.get()))
    _setDebugNextModelLabel('label')
    const label = createModel(async () => `a*b=${await mult.get()}`)
    expect(label.get()).toBe('a*b=6')
    await a.set(3)
    expect(label.get()).toBe('a*b=9')
  })

  test('basic subscribe to derived value', async () => {
    const a = createModel(2)
    const b = createModel(3)
    const mult = createModel(() => a.get() * b.get())
    const onMult = jest.fn()
    mult.subscribe(onMult)
    a.set(3)
    await new Promise((resolve) => setTimeout(resolve, 1))
    expect(onMult).toBeCalledTimes(1)
    expect(onMult).toBeCalledWith(9)
  })

  test('subscribe double derived value', async () => {
    const a = createModel(2)
    const b = createModel(3)
    const mult = createModel(() => a.get() * b.get())
    const label = createModel(() => `a*b=${mult.get()}`)
    const onLabel = jest.fn()
    label.subscribe(onLabel)
    a.set(3)
    await new Promise((resolve) => setTimeout(resolve, 10))
    // expect(label.get()).toBe('a*b=9')
    expect(onLabel).toBeCalledTimes(1)
    expect(onLabel).toBeCalledWith('a*b=9')
  })
})
