import { randomUUID } from 'expo-crypto'
import React from 'react'
import { MMKV } from 'react-native-mmkv'

import { StorageContextProvider, Store } from './provider/storage'

const storage = new MMKV()

function createMMKVStore<StoreValue>(
  storageKey: string,
  initialState: StoreValue
): Store<StoreValue> {
  const storedString = storage.getString(storageKey)
  let state: StoreValue = storedString ? JSON.parse(storedString) : initialState
  const updateHandlers = new Set<() => void>()
  function get() {
    return state
  }
  function subscribe(handler: () => void) {
    updateHandlers.add(handler)
    return () => {
      updateHandlers.delete(handler)
    }
  }
  function set(value: StoreValue) {
    state = value
    storage.set(storageKey, JSON.stringify(value))
    updateHandlers.forEach((h) => h())
  }
  return { get, subscribe, set }
}

export const navigationStore = {
  getRoute() {
    return storage.getString('navRoute')
  },
  setRoute(route: string) {
    storage.set('navRoute', route)
  },
}

const storageContext = {
  uuid: randomUUID,
  connections: createMMKVStore('connections', {
    connections: [],
  }),
}
export function ExpoStorageProvider({ children }: React.PropsWithChildren<object>) {
  // @ts-ignore
  return <StorageContextProvider value={storageContext}>{children}</StorageContextProvider>
}
