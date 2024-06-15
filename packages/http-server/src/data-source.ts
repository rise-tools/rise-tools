import type { EventPayload } from '@rise-tools/http-client'
import {
  isReactElement,
  isResponseModelState,
  isServerEventModelState,
  lookupValue,
  response,
  ServerModelState,
  UI,
} from '@rise-tools/react'

type Initializer = ServerModelState | UI | (() => Promise<ServerModelState | UI>)

export function createHTTPModelSource() {
  const values = new Map<string, Initializer>()

  function update(path: string, value: Initializer) {
    values.set(path, value)
  }

  async function get(path: string) {
    let value = values.get(path)
    if (typeof value === 'function') {
      value = await value()
    }
    if (isReactElement(value)) {
      throw new Error(
        'Rise JSX not configured. You must set "jsx" to "react-jsx" and "jsxImportSource" to "@rise-tools/react" in your tsconfig.json.'
      )
    }
    return value
  }

  async function handleRequest({
    path,
    method,
    body,
  }: {
    path: string
    method: string
    body: unknown
  }) {
    switch (method) {
      case 'GET': {
        return await get(path.startsWith('/') ? path.slice(1) : path)
      }
      case 'POST': {
        // tbd: validate body with `zod`
        const message = body as EventPayload

        const {
          payload,
          target: { path },
        } = message.event

        try {
          const [storeName, ...lookupPath] = path
          const store = await get(storeName)
          const value = lookupValue(store, lookupPath)
          if (!isServerEventModelState(value)) {
            throw new Error(
              `Missing event handler on the server for event: ${JSON.stringify(message.event)}`
            )
          }
          let res = await value.handler(...payload)
          if (!isResponseModelState(res)) {
            res = response(res ?? null)
          }
          return {
            $: 'evt-res',
            res,
          }
        } catch (error: any) {
          return {
            $: 'evt-res',
            res: response(error).status(500),
          }
        }
      }
      default:
        throw new Error('Unsupported method.')
    }
  }

  return { update, handleRequest }
}
