import { afterAll, describe, expect, Mock, test } from 'vitest'
import WS, { WebSocket } from 'ws'

import { state } from '../model-state'
import { AnyModels } from '../types'
import { createWSServer } from '../ws-server'
import { createWaitableMock } from './test-utils'

type TestServerClient = {
  client: WebSocket
  close: () => void
  clientMessages: Mock
  waitForClientMessages: (t: number) => Promise<void>
  clientSend: (data: any) => void
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
  return {
    client,
    clientSend,
    close: () => {
      server.close()
      client.close()
    },
    clientMessages,
    waitForClientMessages,
  }
}

let testA: TestServerClient
let testB: TestServerClient

afterAll(() => {
  testA?.close()
  testB?.close()
})

describe('model server', () => {
  test('basic ws server', async () => {
    const [aState, setA] = state('a')
    const bFunc = () => 'b'
    testA = await testServer({ aState, bFunc }, 4106)
    testA?.clientSend({ $: 'sub', keys: ['aState'] })
    await testA.waitForClientMessages(1)
    expect(testA.clientMessages).toHaveBeenLastCalledWith({ $: 'up', key: 'aState', val: 'a' })
    setA('newA')
    await testA.waitForClientMessages(2)
    expect(testA.clientMessages).toHaveBeenLastCalledWith({ $: 'up', key: 'aState', val: 'newA' })
    testA?.clientSend({ $: 'sub', keys: ['bFunc'] })
    await testA.waitForClientMessages(3)
    expect(testA.clientMessages).toHaveBeenLastCalledWith({ $: 'up', key: 'bFunc', val: 'b' })
  })
  test('events', async () => {
    const [eventHandler, waitForHandlers] = createWaitableMock()
    testB = await testServer(
      {
        EventButton: () => ({
          $: 'component',
          component: 'Button',
          key: 'a',
          props: { onPress: { $: 'event', handler: eventHandler } },
        }),
      },
      4107
    )
    testB?.clientSend({ $: 'sub', keys: ['EventButton'] })
    await testB.waitForClientMessages(1)
    expect(testB.clientMessages).toHaveBeenLastCalledWith({
      $: 'up',
      key: 'EventButton',
      val: {
        $: 'component',
        component: 'Button',
        key: 'a',
        props: { onPress: { $: 'event' } },
      },
    })
    const waitForHandled = waitForHandlers(1)
    testB?.clientSend({
      $: 'evt',
      key: 'eventKey0',
      target: {
        key: 'a',
        component: 'Button',
        propKey: 'onPress',
        path: ['EventButton', 'props', 'onPress'],
      },
      modelState: { $: 'event' },
      payload: ['[native code]'],
    })
    await waitForHandled
    expect(eventHandler).toHaveBeenLastCalledWith('[native code]')
  })
})
