import { afterAll, describe, expect, test } from 'vitest'

import { createHTTPServer } from '../http-server'
import { AnyModels } from '../types'

type TestServer = {
  close: () => void
  fetch: (path: string) => void
}

async function createTestServer(models: AnyModels, port: number) {
  const server = await createHTTPServer(models, port)
  return {
    close: server.close,
    fetch: async (path: string) => {
      const res = await fetch(`http://localhost:${port}${path}`, {})
      return await res.json()
    },
  }
}

let serverA: TestServer

afterAll(() => {
  serverA?.close()
})

describe('http server', () => {
  test('basic http server', async () => {
    serverA = await createTestServer(
      {
        foo: () => ({ hello: 'world' }),
      },
      3000
    )
    expect(await serverA.fetch('/foo')).toEqual({ hello: 'world' })
  })
})
