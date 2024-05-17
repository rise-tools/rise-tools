import {
  _debugNextCreatedModelLabel,
  _setDebugNextModelLabel,
  _setEnableDebug,
  createModel,
} from '../models'

describe('basic models', () => {
  test('setter', () => {
    const model = createModel('foo' as string)
    expect(model.get()).toBe('foo')
    model.set('bar')
    expect(model.get()).toBe('bar')
  })

  test('lazy initializer', () => {
    const model = createModel(() => 'foo' as string)
    expect(model.get()).toBe('foo')
    model.set('bar')
    expect(model.get()).toBe('bar')
  })

  test('invalidate re-calls initializer', () => {
    const initializer = jest.fn()
    initializer.mockReturnValueOnce('a')
    const model = createModel(initializer)
    expect(model.get()).toBe('a')
    expect(initializer).toBeCalledTimes(1)
    initializer.mockReturnValueOnce('b')
    model.invalidate()
    expect(model.get()).toBe('b')
    expect(initializer).toBeCalledTimes(2)
  })
})

describe('derived models', () => {
  test('basic dervied value', () => {
    _setEnableDebug(true)
    _setDebugNextModelLabel('a')
    const a = createModel(2)
    _setDebugNextModelLabel('b')
    const b = createModel(3)
    _setDebugNextModelLabel('mult')
    const mult = createModel(() => a.get() * b.get())
    expect(mult.get()).toBe(6)
    a.set(3)
    expect(mult.get()).toBe(9)
  })

  test('double dervied value', async () => {
    _setEnableDebug(true)
    _setDebugNextModelLabel('a')
    const a = createModel(2)
    _setDebugNextModelLabel('b')
    const b = createModel(3)
    _setDebugNextModelLabel('mult')
    const mult = createModel(() => a.get() * b.get())
    _setDebugNextModelLabel('label')
    const label = createModel(() => `a*b=${mult.get()}`)
    expect(label.get()).toBe('a*b=6')
    a.set(3)
    expect(label.get()).toBe('a*b=9')
  })

  test.only('basic subscribe to derived value', async () => {
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

describe('model server', () => {
  test('basic model http server', async () => {
    const a = createModel(2)
    const b = createModel(3)
    const mult = createModel(() => a.get() * b.get())
    const label = createModel(() => `a*b=${mult.get()}`)
    const server = createModelServer({ b, mult, label })
    server.set('a', a)
  })

  test('basic model http server', async () => {
    const a = createModel(2)
    const b = createModel(3)
    const mult = createModel(() => a.get() * b.get())
    const HomeScreen = createModel(function HomeScreen() {
      return (
        <>
          <Label>the value is: {mult.get()}</Label>
          <Button onPress={() => a.set(a.get() + 1)}>increment</Button>
        </>
      )
    })
    const server = createModelServer({ b, mult, '/': HomeScreen })
    server.set('a', a)
    server.serveHttp(3000)
    server.serveHttpWs(3001)
    server.serveWs(3002)
  })
})
