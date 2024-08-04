import { useStream } from '@rise-tools/react'

import { DEMO_WS_URL } from './config'
import { createMMKVStream } from './storage'

export type ConnectionPayload = {
  id?: string
  label: string
  host: string
  path: string
}

export type Connection = ConnectionPayload & {
  id: string
}

const [stream, write] = createMMKVStream('connections-v2', [] as Connection[])

export const connections = stream

export function useConnection(id?: string) {
  const state = useStream(connections)
  if (!id) {
    return
  }
  if (id === DEMO_CONNECTION.id) {
    return DEMO_CONNECTION
  }
  return state.find((connection) => connection.id === id)
}

export function addConnection(connection: ConnectionPayload) {
  const id = Math.random().toString()
  write((connections) => {
    return [...connections, { ...connection, id }]
  })
  return id
}

export function removeConnection(id: string) {
  write((connections) => {
    return connections.filter((connection) => connection.id !== id)
  })
}

export function updateConnection(id: string, connection: ConnectionPayload) {
  write((connections) => {
    return connections.map((c) => (c.id === id ? { ...c, ...connection } : c))
  })
}

export const DEMO_CONNECTION: Connection = {
  id: 'example',
  label: 'Rise Example UI',
  host: DEMO_WS_URL,
  path: '',
}
