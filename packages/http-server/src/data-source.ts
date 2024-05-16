import { isReactElement, ServerDataState, UI } from '@final-ui/react'

export function createHTTPDataSource() {
  const values = new Map<string, ServerDataState>()

  const getDataStateForPath = (path: string) => {
    return values.get(path)
  }

  function update(key: string, value: ServerDataState | UI) {
    if (isReactElement(value)) {
      throw new Error(
        'Rise JSX not configured. You must set "jsx" to "react-jsx" and "jsxImportSource" to "@final-ui/react" in your tsconfig.json.'
      )
    }
    values.set(key, value)
  }

  function updateRoot(value: ServerDataState | UI) {
    return update('', value)
  }

  function handleRequest(request: Request) {
    const url = new URL(request.url)
    return new Response(JSON.stringify(getDataStateForPath(url.pathname)))
  }

  return { update, updateRoot, handleRequest }
}
