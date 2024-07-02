import { event, EventRequest, HandlerEvent, response } from '@rise-tools/react'
import WS from 'jest-websocket-mock'

import { createWSModelSource } from '../data-source'

let ws: WS

beforeEach(() => {
  ws = new WS('ws://localhost:8080', { jsonProtocol: true })
})
afterEach(() => {
  WS.clean()
})

it('should resolve a promise once response comes in', async () => {
  const dataSource = createWSModelSource('ws://localhost:8080')
  await ws.connected

  const EventRequest: HandlerEvent = {
    $: 'evt',
    key: '1',
    target: {
      key: 'key',
      path: ['mainStore'],
      propKey: 'onPress',
      component: 'View',
    },
    modelState: event(jest.fn()),
    payload: [null],
  }

  const promise = dataSource.sendEvent(EventRequest)

  const message = (await ws.nextMessage) as EventRequest
  ws.send(response({}, { key: message.key }))

  expect(await promise).toMatchInlineSnapshot(`
    Object {
      "$": "response",
      "payload": Object {},
    }
  `)
})

it('should timeout if response comes later than timeout specified', async () => {
  const dataSource = createWSModelSource('ws://localhost:8080')
  await ws.connected

  const EventRequest: HandlerEvent = {
    $: 'evt',
    key: '1',
    target: {
      key: 'key',
      path: ['mainStore'],
      propKey: 'onPress',
      component: 'View',
    },
    modelState: event(jest.fn(), { timeout: 1000 }),
    payload: [null],
  }

  const promise = dataSource.sendEvent(EventRequest)
  const message = (await ws.nextMessage) as EventRequest

  setTimeout(() => {
    ws.send(response({}, { key: message.key }))
  }, 2000)

  expect(promise).rejects.toMatch('timeout')
})
