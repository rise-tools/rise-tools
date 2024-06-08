/**
 * @jest-environment node
 */

import WS, { WebSocket } from 'ws'

import { state } from '../model-state'
import { AnyModels } from '../types'
import { createWSServer } from '../ws-server'

type TestServerClient = {
  client: WebSocket
  close: () => void
  clientMessages: jest.Mock
  waitForClientMessages: (t: number) => Promise<void>
  clientSend: (data: any) => void
}

let testA: TestServerClient

const createWaitableMock = () => {
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

async function testServer(models: AnyModels, port: number): Promise<TestServerClient> {
  const server = createWSServer(models, port)
  const client = new WS(`ws://localhost:${port}`)
  await new Promise<void>((resolve) => client.on('open', resolve))
  const [clientMessages, waitForClientMessages] = createWaitableMock()
  client.on('message', (message) => {
    clientMessages(JSON.parse(message.toString()))
  })
  function clientSend(data: any) {
    client.send(JSON.stringify(data))
  }
  return { client, clientSend, close: server.close, clientMessages, waitForClientMessages }
}

describe('model server', () => {
  test('basic ws server', async () => {
    const [a, setA] = state('a')
    const [b] = state('b')
    testA = await testServer({ a, b }, 4106)
    testA?.clientSend({ $: 'sub', keys: ['a'] })
    await testA.waitForClientMessages(1)
    expect(testA.clientMessages).toHaveBeenLastCalledWith({ $: 'up', key: 'a', val: 'a' })
    setA('newA')
    await testA.waitForClientMessages(2)
    expect(testA.clientMessages).toHaveBeenLastCalledWith({ $: 'up', key: 'a', val: 'newA' })
  })
})

afterAll(() => {
  testA?.close()
})
