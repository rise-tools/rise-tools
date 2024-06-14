import { createWritableStream, JSONValue, WritableStream } from '@rise-tools/react'
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export type Store<T> = {
  get: () => T
  subscribe: (handler: () => void) => () => void
  set: (value: T) => void
}

export function createMMKVStream<T extends JSONValue>(
  storageKey: string,
  initialState: T
): WritableStream<T> {
  const storedString = storage.getString(storageKey)
  const [stream, write] = createWritableStream<T>(
    storedString ? JSON.parse(storedString) : initialState
  )

  return [
    stream,
    function writeMMKVStream(updater) {
      write(updater)
      storage.set(storageKey, JSON.stringify(stream.get()))
    },
  ]
}
