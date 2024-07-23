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
  if (BUILTIN_CONNECTIONS[id]) {
    return BUILTIN_CONNECTIONS[id]
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

export const BUILTIN_CONNECTIONS: Record<string, Connection> = {
  inventory: {
    id: 'inventory',
    label: '🏭 Car Parts Inventory',
    host: DEMO_WS_URL,
    path: 'inventory',
  },
  ui: {
    id: 'ui',
    label: '🎨 UI Controls',
    host: DEMO_WS_URL,
    path: 'controls',
  },
  delivery: {
    id: 'delivery',
    label: '🚚 Super Delivery',
    host: DEMO_WS_URL,
    path: 'delivery',
  },
}
