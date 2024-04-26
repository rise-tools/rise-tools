import {
  type DataSource,
  isHandlerEvent,
  type JSONValue,
  type Store,
  type TemplateEvent,
} from '@final-ui/react'
import React, { useEffect, useState } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { Button, Circle, SizableText, Text, XStack, YStack } from 'tamagui'

export type SubscribeWebsocketMessage = {
  $: 'sub'
  keys: string[]
}

export type UnsubscribeWebsocketMessage = {
  $: 'unsub'
  keys: string[]
}

export type EventWebsocketMessage = {
  $: 'evt'
  event: TemplateEvent
}

export type UpdateWebsocketMessage = {
  $: 'up'
  key: string
  val: JSONValue
}

export type EventResponseWebsocketMessage = {
  $: 'evt-res'
  key: string
  ok: boolean
  val: JSONValue
}

export type ClientWebsocketMessage =
  | SubscribeWebsocketMessage
  | UnsubscribeWebsocketMessage
  | EventWebsocketMessage

export type ServerWebsocketMessage = UpdateWebsocketMessage | EventResponseWebsocketMessage

type Handler = () => void
type PromiseHandler = (value: any) => void

export function createWSDataSource(wsUrl: string): DataSource {
  const rws = new ReconnectingWebSocket(wsUrl)
  function send(payload: ClientWebsocketMessage) {
    rws.send(JSON.stringify(payload))
  }

  const subscriptions = new Map<string, Set<Handler>>()
  const cache = new Map<string, any>()

  rws.addEventListener('open', () => {
    const keys = [...subscriptions.entries()]
      .filter(([, handlers]) => handlers.size > 0)
      .map(([key]) => key)
    if (keys.length === 0) {
      return
    }
    send({
      $: 'sub',
      keys,
    })
  })

  rws.onmessage = (eventData) => {
    const event = JSON.parse(eventData.data) as ServerWebsocketMessage
    switch (event['$']) {
      case 'up': {
        cache.set(event.key, event.val)
        const handlers = subscriptions.get(event.key)
        if (handlers) {
          handlers.forEach((handle) => handle())
        }
        break
      }
      case 'evt-res': {
        const promise = promises.get(event.key)
        if (promise) {
          const [resolve, reject] = promise
          if (event.ok) {
            resolve(event.val)
          } else {
            reject(event.val)
          }
          promises.delete(event.key)
        } else {
          console.warn(`No callback registered for the event: ${JSON.stringify(event)}`)
        }
        break
      }
      default: {
        console.log(`Unknown message: ${JSON.stringify(event)}`)
      }
    }
  }

  const stores = new Map<string, Store>()

  function createStore(key: string) {
    const handlers =
      subscriptions.get(key) ||
      (() => {
        const handlers = new Set<Handler>()
        subscriptions.set(key, handlers)
        return handlers
      })()

    return {
      get: () => cache.get(key),
      subscribe: (handler: () => void) => {
        const shouldSubscribeRemotely = handlers.size === 0
        handlers.add(handler)
        if (shouldSubscribeRemotely) {
          send({
            $: 'sub',
            keys: [key],
          })
        }
        return () => {
          handlers.delete(handler)
          const shouldUnsubscribeRemotely = handlers.size === 0
          if (shouldUnsubscribeRemotely) {
            send({
              $: 'unsub',
              keys: [key],
            })
          }
        }
      },
    }
  }

  const promises = new Map<string, [PromiseHandler, PromiseHandler]>()

  const dataSource: DataSource = {
    get: (key: string) => {
      const store = stores.get(key)
      if (store) {
        return store
      }
      const newStore = createStore(key)
      stores.set(key, newStore)
      return newStore
    },
    sendEvent: async (event) => {
      send({ $: 'evt', event })
      if (isHandlerEvent(event)) {
        return new Promise((resolve, reject) => {
          // tbd: do we want to register a timeout here?
          promises.set(event.dataState.key, [resolve, reject])
        })
      }
    },
    Container: ({ children }) => {
      const [connected, setConnected] = useState(rws.readyState === rws.OPEN)
      useEffect(() => {
        function handleConnectionChange() {
          setConnected(rws.readyState === rws.OPEN)
        }
        rws.addEventListener('open', handleConnectionChange)
        rws.addEventListener('close', handleConnectionChange)
        return () => {
          rws.removeEventListener('open', handleConnectionChange)
          rws.removeEventListener('close', handleConnectionChange)
        }
      }, [])

      // tbd: render Error component with message when "disconnected" or "error"
      // and no UI to display
      return (
        <YStack>
          {children}
          <XStack position="absolute" top={0} right={0} padding="$2">
            <XStack backgroundColor="transparent" alignItems="center" gap="$2">
              <SizableText size="$1" color="grey">
                Status:
              </SizableText>
              <Circle size={5} backgroundColor={connected ? 'green' : 'red'} />
            </XStack>
            {!connected && (
              <Button
                onPress={() => {
                  rws.reconnect()
                }}
              >
                Reconnect
              </Button>
            )}
          </XStack>
        </YStack>
      )
    },
  }

  return dataSource
}
