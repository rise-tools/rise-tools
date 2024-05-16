import { isReactElement, ServerDataState, UI } from '@final-ui/react'

type Initializer = ServerDataState | UI | (() => Promise<ServerDataState | UI>)

export function createHTTPDataSource() {
  const values = new Map<string, Initializer>()
  const cache = new Map<string, ServerDataState>()

  function update(key: string, value: Initializer) {
    values.set(key, value)
  }

  async function get(path: string) {
    if (cache.has(path)) {
      return cache.get(path)
    }
    let value = values.get(path)
    if (typeof value === 'function') {
      value = await value()
    }
    if (isReactElement(value)) {
      throw new Error(
        'Rise JSX not configured. You must set "jsx" to "react-jsx" and "jsxImportSource" to "@final-ui/react" in your tsconfig.json.'
      )
    }
    cache.set(path, value)
    return value
  }

  async function handleRequest(request: Request) {
    const url = new URL(request.url)
    return new Response(JSON.stringify(await get(url.pathname)))
  }

  return { update, handleRequest }
}
