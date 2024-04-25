import { createContext, useContext, useSyncExternalStore } from 'react'

export type Store<V> = {
  get: () => V
  subscribe: (handler: () => void) => () => void
  set: (value: V) => void
}

export type Connection = {
  id: string
  label: string
  host: string
  path: string
}

export type ConnectionsState = {
  connections: Connection[]
}

type StorageContext = {
  connections: Store<ConnectionsState>
  uuid: () => string
}

const StorageContext = createContext<null | StorageContext>(null)

function useStorage() {
  const context = useContext(StorageContext)
  if (!context) throw new Error('useStorage must be used within a StorageProvider')
  return context
}

export const StorageContextProvider = StorageContext.Provider

export function useConnections() {
  const storage = useStorage()
  const state = useSyncExternalStore<ConnectionsState>(
    storage.connections.subscribe,
    storage.connections.get
  )
  function update(updater: (state: ConnectionsState) => ConnectionsState) {
    storage.connections.set(updater(state))
  }
  function addConnection(connection: Omit<Connection, 'id'> & { id?: string }) {
    const newConnection = { ...connection, id: connection.id ?? storage.uuid() }
    update((state) => ({
      ...state,
      connections: [...state.connections, newConnection],
    }))
    return newConnection.id
  }
  return [state, { update, addConnection }] as const
}

export function useConnection(id?: string) {
  const [state, { update: updateConnections }] = useConnections()

  if (!id) {
    return [undefined]
  }

  if (BUILTIN_CONNECTIONS[id]) {
    return [
      BUILTIN_CONNECTIONS[id],
      {
        update: () => {
          throw new Error('Cannot update built-in connection')
        },
        remove: () => {
          throw new Error('Cannot remove built-in connection')
        },
      },
    ] as const
  }

  function update(updater: (state: Connection) => Connection) {
    updateConnections((state) => ({
      ...state,
      connections: state.connections.map((connection) =>
        connection.id === id ? updater(connection) : connection
      ),
    }))
  }
  function remove() {
    updateConnections((state) => ({
      ...state,
      connections: state.connections.filter((connection) => connection.id !== id),
    }))
  }

  return [state.connections.find((connection) => connection.id === id), { update, remove }] as const
}

// tbd: move to separate file and use envs for host/path
export const BUILTIN_CONNECTIONS: Record<string, Connection> = {
  inventory: {
    id: 'inventory',
    label: '🏭 Car Parts Inventory',
    host: 'ws://localhost:3005',
    path: 'inventory',
  },
}
