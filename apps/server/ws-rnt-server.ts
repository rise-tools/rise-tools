import WebSocket from 'ws'

type EventHandler = (
  eventPath: string,
  eventName: string,
  value: any,
  eventOpts: {
    time: number
    clientId: string
  }
) => void

export function createWSServer(port: number) {
  const wss = new WebSocket.Server({ port })

  const values = new Map<string, any>()

  const clientSubscribers = new Map<string, Map<string, () => void>>()

  const subscribers = new Map<string, Set<(value: any) => void>>()

  const eventSubscribers = new Set<EventHandler>()

  function update(key: string, value: any) {
    values.set(key, value)
    const handlers = clientSubscribers.get(key)
    if (!handlers) return
    handlers.forEach((handler) => handler())
  }

  function clientSubscribe(clientId: string, key: string) {
    function send() {
      const sender = clientSenders.get(clientId)
      if (!sender) return
      sender({ $: 'up', key, val: values.get(key) })
    }
    const handlers: Map<string, () => void> = clientSubscribers.has(key)
      ? clientSubscribers.get(key)
      : (() => {
          const handlers = new Map<string, () => void>()
          clientSubscribers.set(key, handlers)
          return handlers
        })()
    handlers.set(clientId, send)
    send()
  }

  function clientUnsubscribe(clientId: string, key: string) {
    const handlers = clientSubscribers.get(key)
    if (!handlers) return
    handlers.delete(clientId)
  }

  function clientSubscribes(clientId: string, message: any) {
    message.keys.forEach((key: string) => clientSubscribe(clientId, key))
  }

  function clientUnsubscribes(clientId: string, message: any) {
    message.keys.forEach((key: string) => clientUnsubscribe(clientId, key))
  }

  function handleEvent(clientId: string, message: any) {
    eventSubscribers.forEach((handler) =>
      handler(message.path, message.name, message.value, {
        time: Date.now(),
        clientId,
      })
    )
  }

  let clientIdIndex = 0

  const clientSenders = new Map<string, (value: any) => void>()

  wss.on('connection', function connection(ws) {
    const clientId = `c${clientIdIndex}`
    clientIdIndex += 1
    console.log(`Client ${clientId} connected`)

    function sendClient(value: any) {
      ws.send(JSON.stringify(value))
    }

    clientSenders.set(clientId, sendClient)

    ws.on('close', function close() {
      clientSenders.delete(clientId)
      console.log(`Client ${clientId} disconnected`)
    })

    ws.on('message', function incoming(messageString: string) {
      const message = JSON.parse(messageString.toString())
      switch (message['$']) {
        case 'sub':
          return clientSubscribes(clientId, message)
        case 'unsub':
          return clientUnsubscribes(clientId, message)
        case 'evt':
          return handleEvent(clientId, message)
        default:
          console.log('Unrecognized message:', messageString)
          return
      }
    })
  })

  function updateRoot(value: any) {
    update('', value)
  }

  function subscribeEvent(handler: EventHandler) {
    eventSubscribers.add(handler)
    return () => eventSubscribers.delete(handler)
  }

  function get(key: string) {
    return values.get(key)
  }

  function subscribe(key: string, handler: (value: any) => void) {
    const handlers: Set<(value: any) => void> = subscribers.has(key)
      ? subscribers.get(key)
      : (() => {
          const handlers = new Set<(value: any) => void>()
          subscribers.set(key, handlers)
          return handlers
        })()
    handler(values.get(key))
    handlers.add(handler)
    return () => handlers.delete(handler)
  }

  wss.on('listening', () => {
    console.log(`WebSocket server started on port ${port}`)
  })

  return { update, subscribeEvent, subscribe, get, updateRoot }
}
