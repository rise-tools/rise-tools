import { event, EventRequest, HandlerEvent, response } from '@rise-tools/react'
import WS from 'jest-websocket-mock'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

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
    modelState: event(vi.fn()),
    payload: [null],
  }

  const promise = dataSource.sendEvent(EventRequest)

  const message = (await ws.nextMessage) as EventRequest
  ws.send(response({}, { key: message.key }))

  expect(await promise).toMatchInlineSnapshot(`
    {
      "$": "evt-res",
      "key": "1",
      "payload": {},
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
    modelState: event(vi.fn(), { timeout: 1000 }),
    payload: [null],
  }

  const promise = dataSource.sendEvent(EventRequest)
  const message = (await ws.nextMessage) as EventRequest

  setTimeout(() => {
    ws.send(response({}, { key: message.key }))
  }, 2000)

  expect(promise).rejects.toBeInstanceOf(Error)
})
