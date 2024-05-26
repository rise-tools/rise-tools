import { response, TemplateEvent } from '@final-ui/react'
import WS from 'jest-websocket-mock'

import {
  createWSDataSource,
  EventResponseWebsocketMessage,
  EventWebsocketMessage,
} from '../data-source'

let ws: WS

beforeEach(() => {
  ws = new WS('ws://localhost:8080', { jsonProtocol: true })
})
afterEach(() => {
  WS.clean()
})

it('should resolve a promise once response comes in', async () => {
  const dataSource = createWSDataSource('ws://localhost:8080')
  await ws.connected

  const event: TemplateEvent = {
    target: {
      key: 'key',
      path: 'mainStore',
      propKey: 'onPress',
      component: 'View',
    },
    dataState: {
      $: 'event',
      key: 'key',
    },
    payload: null,
  }

  const promise = dataSource.sendEvent(event)

  const message = (await ws.nextMessage) as EventWebsocketMessage
  ws.send({
    $: 'evt-res',
    key: message.key,
    res: response({}),
  } satisfies EventResponseWebsocketMessage)

  expect(await promise).toMatchInlineSnapshot(`
    Object {
      "$": "response",
      "actions": Array [],
      "ok": true,
      "payload": Object {},
      "statusCode": 200,
    }
  `)
})

it('should timeout if response comes later than timeout specified', async () => {
  const dataSource = createWSDataSource('ws://localhost:8080')
  await ws.connected

  const event: TemplateEvent = {
    target: {
      key: 'key',
      path: 'mainStore',
      propKey: 'onPress',
      component: 'View',
    },
    dataState: {
      $: 'event',
      key: 'key',
      timeout: 1000,
    },
    payload: null,
  }

  const promise = dataSource.sendEvent(event)
  const message = (await ws.nextMessage) as EventWebsocketMessage

  setTimeout(() => {
    ws.send({
      $: 'evt-res',
      key: message.key,
      res: response({}),
    } satisfies EventResponseWebsocketMessage)
  }, 2000)

  expect(promise).rejects.toMatch('timeout')
})
