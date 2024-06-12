import { useStream } from '@rise-tools/react'

import { createMMKVStream } from './storage'

export type ConnectionPayload = {
  id?: string
  label: string
  host: string
  path?: string
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
  write((connections) => {
    return [...connections, { ...connection, id: Math.random().toString() }]
  })
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
    host: process.env.EXPO_PUBLIC_DEMO_WS_URL as string,
    path: 'inventory',
  },
  // ui: {
  //   id: 'ui',
  //   label: '🏭 UI Controls',
  //   host: process.env.EXPO_PUBLIC_DEMO_WS_URL as string,
  //   path: 'ui',
  // },
}
