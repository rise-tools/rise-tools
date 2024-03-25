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

export function useConnection(id: string | undefined) {
  const [connections, { update: updateConnections }] = useConnections()
  const state = id ? connections.connections.find((connection) => connection.id === id) : undefined
  function update(updater: (state: Connection) => Connection) {
    updateConnections((connections) => ({
      ...connections,
      connections: connections.connections.map((connection) =>
        connection.id === id ? updater(connection) : connection
      ),
    }))
  }
  function remove() {
    updateConnections((connections) => ({
      ...connections,
      connections: connections.connections.filter((connection) => connection.id !== id),
    }))
  }
  return [state, { update, remove }] as const
}
