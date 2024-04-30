import { TemplateEvent } from '@final-ui/react'
import WS from 'jest-websocket-mock'

import { createWSDataSource, EventResponseWebsocketMessage } from '../data-source'

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
      component: 'View',
    },
    dataState: {
      $: 'event',
      key: 'key',
    },
    payload: null,
  }
  const response: EventResponseWebsocketMessage = {
    $: 'evt-res',
    key: 'key',
    ok: true,
    val: 'response',
  }

  const promise = dataSource.sendEvent(event)
  ws.send(response)

  expect(await promise).toEqual('response')
})

it('should timeout if response comes later than timeout specified', async () => {
  const dataSource = createWSDataSource('ws://localhost:8080')
  await ws.connected

  const event: TemplateEvent = {
    target: {
      key: 'key',
      path: 'mainStore',
      component: 'View',
    },
    dataState: {
      $: 'event',
      key: 'key',
      timeout: 1000,
    },
    payload: null,
  }
  const response: EventResponseWebsocketMessage = {
    $: 'evt-res',
    key: 'key',
    ok: true,
    val: 'response',
  }

  const promise = dataSource.sendEvent(event)
  setTimeout(() => {
    ws.send(response)
  }, 2000)

  expect(promise).rejects.toMatch('timeout')
})
