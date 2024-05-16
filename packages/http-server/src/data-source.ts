import { isReactElement, ServerDataState, UI } from '@final-ui/react'

type Initializer = ServerDataState | UI | (() => Promise<ServerDataState | UI>)

export function createHTTPDataSource() {
  const values = new Map<string, Initializer>()

  function update(key: string, value: Initializer) {
    values.set(key, value)
  }

  async function get(path: string) {
    let value = values.get(path)
    if (typeof value === 'function') {
      value = await value()
    }
    if (isReactElement(value)) {
      throw new Error(
        'Rise JSX not configured. You must set "jsx" to "react-jsx" and "jsxImportSource" to "@final-ui/react" in your tsconfig.json.'
      )
    }
    return value
  }

  async function handleRequest(request: Request) {
    const url = new URL(request.url)
    switch (request.method) {
      case 'GET': {
        return new Response(JSON.stringify(await get(url.pathname)))
      }
      case 'POST': {
        // const data = await get(url.pathname)
        // tbd: handle events
        // return new Response(JSON.stringify({}))
        throw new Error('Unsupported method.')
      }
      default:
        throw new Error('Unsupported method.')
    }
  }

  return { update, handleRequest }
}
