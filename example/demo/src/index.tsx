import { lookup, state, view } from '@final-ui/server'

import defaultInventory from './inventory/inventory'

// inventory example
const [inventoryItems, setInventoryItems] = state(defaultInventory)
const inventory = view(({ get }) => <HomeScreen items={get(inventoryItems)} />)
const inventoryItem = lookup((key) =>
  view(({ get }) => {
    const inventoryItem = get(inventoryItems).find((i) => i.key === key)
    if (!inventoryItem) return <NotFound />
    return (
      <Item
        item={get(inventoryItems).get(key)}
        onItemUpdate={() => {
          // use setInventoryItems here
        }}
      />
    )
  })
)

// user profile example
// const userProfile = lookup((key) =>
//   query(async () => {
//     return await db.getUser(key)
//   })
// )
// const userForm = lookup((key) =>
//   view(({ get, invalidate }) => {
//     const user = get(userProfile, key)
//     return (
//       <UserForm
//         user={user}
//         onUpdate={async (payload) => {
//           await db.writeUser(key, payload)
//           invalidate(userProfile, key)
//         }}
//       />
//     )
//   })
// )

export default {
  async fetch(request: Request): Promise<Response> {
    const upgrade = request.headers.get('Upgrade')
    if (!upgrade || upgrade !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 })
    }

    const webSocketPair = new WebSocketPair()
    const wsServer = webSocketPair[1]

    wsServer.accept()

    const server = await setupDataSource()
    server.handleWSConnection(wsServer)

    return new Response(null, {
      status: 101,
      webSocket: webSocketPair[0],
    })
  },
}
