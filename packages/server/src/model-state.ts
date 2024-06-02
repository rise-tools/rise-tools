export function state<T>(initial: T): [StateModel<T>, StateSetter<T>] {
  let value = initial
  const listeners = new Set<(newState: T) => void>()
  function get() {
    return value
  }
  function set(updater: T | ((state: T) => T)) {
    if (typeof updater === 'function') {
      value = (updater as (state: T) => T)(value)
    } else {
      value = updater
    }
    listeners.forEach((listener) => listener(value))
  }
  function subscribe(listener: (newState: T) => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
  return [{ get, subscribe }, set] as const
}
